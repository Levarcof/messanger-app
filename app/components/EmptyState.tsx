const EmptyState = () => {
  return (
    <div
      className="
        px-4
        py-10
        sm:px-6
        lg:px-8
        h-full
        flex
        justify-center
        items-center
        bg-[#0a0a0a]
      "
    >
      <div className="text-center items-center flex flex-col max-w-sm">
        <div className="w-20 h-20 bg-wine-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-wine ring-1 ring-wine-500/20">
          <div className="w-10 h-10 rounded-xl bg-wine-500/20 animate-pulse" />
        </div>
        <h3
          className="
            text-2xl
            font-bold
            text-white
            tracking-tight
          "
        >
          Select an elegant conversation
        </h3>
        <p className="mt-2 text-neutral-500 text-sm font-medium">
          Choose from your sophisticated dialogues or start a new high-end interaction.
        </p>
      </div>
    </div>
  );
}

export default EmptyState;