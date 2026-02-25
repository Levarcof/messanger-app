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
        bg-[#0b1120]
      "
    >
      <div className="text-center items-center flex flex-col max-w-sm">
        <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-8 shadow-blue-glow ring-1 ring-blue-600/20">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 animate-pulse" />
        </div>
        <h3
          className="
            text-2xl
            font-bold
            text-white
            tracking-tight
          "
        >
          Select a premium conversation
        </h3>
        <p className="mt-2 text-gray-400 text-sm font-medium">
          Choose from your sophisticated dialogues or start a new high-end interaction.
        </p>
      </div>
    </div>
  );
}

export default EmptyState;