import { Leaf, Heart, Globe, Award } from "lucide-react";

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="section-spacing bg-gradient-to-br from-[oklch(0.97_0.01_85)] to-[oklch(0.95_0.015_75)]">
        <div className="container text-center max-w-3xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">Our Story</p>
          <h1 className="heading-serif text-4xl md:text-5xl text-foreground mb-6">
            A Legacy of Wellness
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            KN Naturals was born from a simple belief: that nature holds the key to balanced, vibrant living. 
            We source the finest botanicals from trusted farmers and craft each blend with intention.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section-spacing">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "Natural Purity", desc: "Every ingredient is carefully sourced, organic where possible, and free from artificial additives." },
              { icon: Heart, title: "Wellness First", desc: "Each blend is crafted with specific wellness benefits in mind, backed by traditional wisdom." },
              { icon: Globe, title: "Ethical Sourcing", desc: "We work directly with farmers, ensuring fair wages and sustainable agricultural practices." },
              { icon: Award, title: "Premium Quality", desc: "Third-party tested for purity and potency. We never compromise on quality." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-secondary/60 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-brand-green" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-spacing bg-white">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="heading-serif text-3xl mb-6">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We believe that wellness should be accessible, enjoyable, and integrated into daily life. 
            Our mission is to provide premium, natural products that support active lifestyles and 
            promote holistic health — from the first sip of morning matcha to the calming evening ritual.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Every product in our collection is designed to help you feel your best: energized, 
            balanced, and connected to the natural world. We're committed to transparency, 
            sustainability, and the pursuit of genuine wellness.
          </p>
        </div>
      </section>
    </div>
  );
}
