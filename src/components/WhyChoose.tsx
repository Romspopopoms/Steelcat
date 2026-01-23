import Link from 'next/link';

export default function WhyChoose() {
  const benefits = [
    {
      number: "1",
      title: "Hygiène incomparable",
      description: "L'acier inoxydable est non poreux, il ne retient ni odeurs, ni bactéries, ni urine séchée. Contrairement au plastique qui absorbe les odeurs au fil du temps, même avec un nettoyage régulier.",
      icon: "✨"
    },
    {
      number: "2",
      title: "Zéro taches, zéro rayures",
      description: "Le plastique se raye facilement, ce qui crée des micro-fissures où s'accumulent les odeurs et les microbes. L'acier inoxydable garde une surface lisse et propre, même après des années d'utilisation.",
      icon: "💎"
    },
    {
      number: "3",
      title: "Durabilité extrême",
      description: "Incassable, ne se déforme pas, ne jaunit pas. Une litière en acier inoxydable peut durer 10 à 20 ans, là où le plastique doit souvent être remplacé tous les 6 à 12 mois.",
      icon: "🛡️"
    },
    {
      number: "4",
      title: "Nettoyage ultra-rapide",
      description: "Les déchets glissent naturellement sur la surface métallique. Plus besoin de récurer : un simple rinçage suffit.",
      icon: "⚡"
    },
    {
      number: "5",
      title: "Sans produits chimiques",
      description: "L'acier inoxydable est 100 % sûr, sans BPA, sans toxines, sans risque de libération de particules. Idéal pour les chats sensibles, allergiques ou sujets aux irritations.",
      icon: "🌿"
    },
    {
      number: "6",
      title: "Résiste aux odeurs, à l'urine acide et à tous types de litière",
      description: "L'acier ne se dégrade pas avec l'acidité de l'urine comme le plastique. Il supporte la litière agglomérante, végétale, minérale, etc.",
      icon: "🔬"
    },
    {
      number: "7",
      title: "Écologique et durable",
      description: "Une seule litière en acier = plusieurs dizaines de litières plastique évitées. 100 % recyclable en fin de vie.",
      icon: "♻️"
    },
    {
      number: "8",
      title: "Esthétique premium",
      description: "Donne un look moderne, propre et haut de gamme dans la maison. Ne fait pas « bac en plastique » visible dans le salon.",
      icon: "✨"
    }
  ];

  return (
    <section id="pourquoi" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            POURQUOI CHOISIR STEELCAT ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une litière premium pensée pour le confort de votre chat et la simplicité de votre quotidien.
          </p>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            Avantages de l'acier inoxydable vs plastique
          </h3>
          <p className="text-gray-600">(litière à chat)</p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.number}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center text-2xl font-bold">
                  {benefit.number}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{benefit.icon}</span>
                    <h4 className="text-xl font-bold text-gray-900">{benefit.title}</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/produit"
            className="inline-block bg-black text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            Découvrir SteelCat
          </Link>
        </div>
      </div>
    </section>
  );
}
