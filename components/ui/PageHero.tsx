interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  gold?: boolean;
}

export default function PageHero({ title, subtitle, children, gold = false }: PageHeroProps) {
  return (
    <section
      className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-texture"
      style={{ backgroundColor: "#1a2e1a" }}
    >
      <div className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, #2d5a2720 0%, transparent 70%)"
        }}
      />
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className={`font-rubik font-black text-4xl sm:text-5xl lg:text-6xl mb-4 ${gold ? "text-gold" : "text-white"}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
