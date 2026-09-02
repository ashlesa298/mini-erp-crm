import prisma from "../../config/database";
import ApiError from "../../utils/apiError";

import {
  CreateProductInput,
  UpdateProductInput,
  ListProductQuery,
  StockMovementInput,
} from "./product.validation";

// CREATE PRODUCT
export const createProduct = async (
  data: CreateProductInput,
  createdById: number
) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      sku: data.sku,
    },
  });

  if (existingProduct) {
    throw new ApiError(409, "Product with this SKU already exists");
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      category: data.category || null,
      unitPrice: data.unitPrice,
      currentStock: data.currentStock,
      minStock: data.minStock,
      warehouse: data.warehouse || null,

      ...(data.currentStock > 0
        ? {
            stockMovements: {
              create: {
                type: "IN",
                quantity: data.currentStock,
                reason: "Initial stock",
                createdById,
              },
            },
          }
        : {}),
    },

    include: {
      stockMovements: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  return product;
};

// GET ALL PRODUCTS
export const listProducts = async (
  query: ListProductQuery
) => {
  const {
    page,
    limit,
    search,
    category,
    lowStock,
  } = query;

  const where = {
    ...(category
      ? {
          category: {
            equals: category,
            mode: "insensitive" as const,
          },
        }
      : {}),

    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              sku: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              category: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(lowStock === "true"
      ? {
          currentStock: {
            lte: prisma.product.fields.minStock,
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    items,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(
        Math.ceil(total / limit),
        1
      ),
    },
  };
};

// GET PRODUCT BY ID
export const getProductById = async (
  id: number
) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },

    include: {
      stockMovements: {
        orderBy: {
          createdAt: "desc",
        },

        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

// UPDATE PRODUCT
export const updateProduct = async (
  id: number,
  data: UpdateProductInput
) => {
  await getProductById(id);

  if (data.sku !== undefined) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: data.sku,
        NOT: {
          id,
        },
      },
    });

    if (existingProduct) {
      throw new ApiError(
        409,
        "Product with this SKU already exists"
      );
    }
  }

  const product = await prisma.product.update({
    where: {
      id,
    },

    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.sku !== undefined && {
        sku: data.sku,
      }),

      ...(data.category !== undefined && {
        category:
          data.category === ""
            ? null
            : data.category,
      }),

      ...(data.unitPrice !== undefined && {
        unitPrice: data.unitPrice,
      }),

      ...(data.minStock !== undefined && {
        minStock: data.minStock,
      }),

      ...(data.warehouse !== undefined && {
        warehouse:
          data.warehouse === ""
            ? null
            : data.warehouse,
      }),
    },
  });

  return product;
};

// ADD STOCK MOVEMENT
export const addStockMovement = async (
  productId: number,
  data: StockMovementInput,
  createdById: number
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (data.type === "OUT") {
    if (data.quantity > product.currentStock) {
      throw new ApiError(
        400,
        `Insufficient stock. Available stock: ${product.currentStock}`
      );
    }
  }

  const newStock =
    data.type === "IN"
      ? product.currentStock + data.quantity
      : product.currentStock - data.quantity;

  const result = await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: {
        id: productId,
      },

      data: {
        currentStock: newStock,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId,
        type: data.type,
        quantity: data.quantity,
        reason: data.reason || null,
        createdById,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      product: updatedProduct,
      movement,
    };
  });

  return result;
};

// GET STOCK MOVEMENTS
export const listStockMovements = async (
  productId: number
) => {
  await getProductById(productId);

  const movements = await prisma.stockMovement.findMany({
    where: {
      productId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return movements;
};