interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionTitle({ title, subtitle, centered = true, light = false }: SectionTitleProps) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""}`}>
      <h2 className={`font-rubik font-bold text-3xl sm:text-4xl mb-3 ${light ? "text-white" : "text-green-darkest"}`}>
        {title}
      </h2>
      <div className={`h-1 w-16 rounded-full ${centered ? "mx-auto" : ""} bg-green-mid mb-4`} />
      {subtitle && (
        <p className={`text-base sm:text-lg max-w-2xl ${centered ? "mx-auto" : ""} leading-relaxed ${light ? "text-gray-300" : "text-gray-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
