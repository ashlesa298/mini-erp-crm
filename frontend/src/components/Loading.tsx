const Loading = ({ label = "Loading..." }: { label?: string }) => {
  return (
    <div className="loading-wrap">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
};

export default Loading;