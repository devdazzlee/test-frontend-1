"use client";

const HomeLoader = () => {
  return (
    <div className="container text-center justify-center mx-auto mt-24">
      {/* <!-- Title --> */}

      {/* <!-- Balances --> */}
      <div className="skeleton-balance my-2 h-8 w-full rounded bg-gray-700 animate-pulse"></div>
      <div className="skeleton-balance my-2 h-8 w-full rounded bg-gray-700 animate-pulse"></div>
      <div className="skeleton-balance my-2 h-8 w-full rounded bg-gray-700 animate-pulse"></div>
      <div className="skeleton-balance my-2 h-8 w-full rounded bg-gray-700 animate-pulse"></div>

      {/* <!-- Toggle Buttons --> */}
      <div className="flex justify-center gap-4 my-4">
        <div className="skeleton-button h-10 w-24 rounded-full bg-gray-700 animate-pulse"></div>
        <div className="skeleton-button h-10 w-24 rounded-full bg-gray-700 animate-pulse"></div>
      </div>

      {/* <!-- Input Box --> */}
      <div className="skeleton-input h-12 w-full rounded bg-gray-700 animate-pulse my-3"></div>
      <div className="skeleton-estimate h-4 w-1/2 mx-auto rounded bg-gray-700 animate-pulse"></div>

      {/* <!-- Buy Button --> */}
      <div className="skeleton-buy-button h-12 w-full rounded-lg bg-gray-700 animate-pulse my-4"></div>

      {/* <!-- Table --> */}
      <div className="mt-4">
        <div className="skeleton-table-header h-8 w-full bg-gray-700 animate-pulse rounded"></div>
        <div className="skeleton-table-row h-6 w-full bg-gray-700 animate-pulse rounded mt-2"></div>
        <div className="skeleton-table-row h-6 w-full bg-gray-700 animate-pulse rounded mt-2"></div>
      </div>
    </div>
  );
};

export default HomeLoader;
