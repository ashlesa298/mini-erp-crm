import prisma from "../../config/database";
import ApiError from "../../utils/apiError";

import {
  CreateCustomerInput,
  UpdateCustomerInput,
  FollowUpInput,
  ListCustomerQuery,
} from "./customer.validation";

// CREATE CUSTOMER
export const createCustomer = async (
  data: CreateCustomerInput,
  createdById: number
) => {
  const customer = await prisma.customer.create({
    data: {
      name: data.name,
      mobile: data.mobile,
      email: data.email || null,
      businessName: data.businessName || null,
      gstNumber: data.gstNumber || null,
      customerType: data.customerType,
      address: data.address || null,
      status: data.status,
      followUpDate: data.followUpDate ?? null,
      notes: data.notes || null,
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

  return customer;
};

// GET ALL CUSTOMERS
export const listCustomers = async (
  query: ListCustomerQuery
) => {
  const {
    page,
    limit,
    search,
    status,
    customerType,
  } = query;

  const where = {
    ...(status
      ? {
          status,
        }
      : {}),

    ...(customerType
      ? {
          customerType,
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
              mobile: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              businessName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
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
    }),

    prisma.customer.count({
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

// GET CUSTOMER BY ID
export const getCustomerById = async (
  id: number
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
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

      followUps: {
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

  if (!customer) {
    throw new ApiError(
      404,
      "Customer not found"
    );
  }

  return customer;
};

// UPDATE CUSTOMER
export const updateCustomer = async (
  id: number,
  data: UpdateCustomerInput
) => {
  // Check customer exists
  await getCustomerById(id);

  const customer = await prisma.customer.update({
    where: {
      id,
    },

    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.mobile !== undefined && {
        mobile: data.mobile,
      }),

      ...(data.email !== undefined && {
        email: data.email === "" ? null : data.email,
      }),

      ...(data.businessName !== undefined && {
        businessName:
          data.businessName === ""
            ? null
            : data.businessName,
      }),

      ...(data.gstNumber !== undefined && {
        gstNumber:
          data.gstNumber === ""
            ? null
            : data.gstNumber,
      }),

      ...(data.customerType !== undefined && {
        customerType: data.customerType,
      }),

      ...(data.address !== undefined && {
        address:
          data.address === ""
            ? null
            : data.address,
      }),

      ...(data.status !== undefined && {
        status: data.status,
      }),

      ...(data.followUpDate !== undefined && {
        followUpDate: data.followUpDate,
      }),

      ...(data.notes !== undefined && {
        notes:
          data.notes === ""
            ? null
            : data.notes,
      }),
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

  return customer;
};

// ADD FOLLOW-UP
export const addFollowUp = async (
  customerId: number,
  data: FollowUpInput,
  createdById: number
) => {
  // Check customer exists
  await getCustomerById(customerId);

  const followUp = await prisma.followUp.create({
    data: {
      customerId,
      note: data.note,
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

  return followUp;
};