import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="page-enter">
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pt-16 pb-12 text-center">
        <div className="divider-label max-w-[200px] mx-auto mb-8">Our Story</div>
        <h1 className="font-display text-5xl md:text-7xl italic font-light leading-[0.95] mb-8">
          Rooted in ritual. <br />
          <span className="text-moss">Grown in science.</span>
        </h1>
        <p className="text-lg text-ink-60 max-w-2xl mx-auto leading-relaxed">
          Shreeshar was born from a simple frustration: the wellness aisle was full
          of promises, but short on proof. We set out to build something different.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-8">
        <div className="relative aspect-[16/9] rounded-sm overflow-hidden">
          <Image
            src="/banners/family-shot.png"
            alt="Shreeshar product family"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="space-y-10 font-display text-xl md:text-2xl italic leading-relaxed text-ink/90">
          <p>
            Every formula starts with one question: <em>does it actually work?</em>
          </p>
          <p className="not-italic font-sans text-base text-ink-60">
            Our founders grew up on herbs passed down from grandmothers — ashwagandha
            for anxious nights, turmeric for aching joints, tulsi for everything
            else. Moving to modern life, they found the same wisdom bottled by brands
            that cared more about marketing than ingredients. So we built Shreeshar
            to close that gap. We partner with Ayurvedic practitioners, cross-check
            with clinical literature, and third-party test every batch before it
            ships.
          </p>
          <p>
            Ancient roots. Honest labels. <span className="text-moss">Real results.</span>
          </p>
        </div>
      </section>

      <section className="bg-cream/60 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 className="font-display text-4xl md:text-5xl italic text-center mb-16 leading-tight">
            Our non-negotiables
          </h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-16">
            {[
              {
                t: 'Clinically meaningful doses',
                d: 'We use full-strength extracts at doses studied in trials — not pixie dust for the label.',
              },
              {
                t: 'Third-party tested',
                d: 'Every batch is verified for potency, purity, and contaminants. Reports on request.',
              },
              {
                t: 'Small-batch, slow-made',
                d: 'We ship fresh. Nothing sits in a warehouse. Nothing is over-produced.',
              },
            ].map((v, i) => (
              <div key={i}>
                <div className="font-display text-4xl italic text-moss mb-3">0{i + 1}</div>
                <h3 className="font-display text-2xl italic mb-3">{v.t}</h3>
                <p className="text-ink-60 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-12 py-24 md:py-32 text-center">
        <h2 className="font-display text-5xl md:text-6xl italic leading-tight mb-8">
          Start your ritual.
        </h2>
        <Link href="/shop" className="btn-primary">
          Shop the Collection
        </Link>
      </section>
    </div>
  );
}
