import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Les Jardins de l'Hacienda — informations légales, éditeur, hébergeur et politique de confidentialité.",
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <div className="bg-cream min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-terracotta pt-32 pb-16">
        <div className="container-main">
          <span className="eyebrow text-gold/60 mb-5 block">Informations légales</span>
          <h1 className="font-display font-bold text-cream leading-none tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>
            Mentions légales
          </h1>
          <div className="w-14 h-px bg-gold mt-6" />
        </div>
      </section>

      {/* ── CONTENU ──────────────────────────────────────────── */}
      <section className="py-section">
        <div className="container-main max-w-3xl">
          <div className="prose-hacienda space-y-12">

            {/* 1. Éditeur */}
            <article>
              <h2 className="font-heading font-semibold text-xl text-terracotta mb-4 pb-2 border-b border-terracotta/10">
                1. Éditeur du site
              </h2>
              <div className="space-y-2 font-sans text-base text-terracotta/70 leading-relaxed">
                <p><strong className="text-terracotta font-medium">Raison sociale :</strong> Les Jardins de l&apos;Hacienda</p>
                <p><strong className="text-terracotta font-medium">Forme juridique :</strong> <span className="bg-gold/15 text-gold-dark px-2 py-0.5 text-xs font-sans italic">[ à compléter ]</span></p>
                <p><strong className="text-terracotta font-medium">SIRET :</strong> <span className="bg-gold/15 text-gold-dark px-2 py-0.5 text-xs font-sans italic">[ à compléter ]</span></p>
                <p><strong className="text-terracotta font-medium">Adresse :</strong> 6 Vathier Haye, 54580 Moineville, France</p>
                <p><strong className="text-terracotta font-medium">Téléphone :</strong> <a href="tel:0609386764" className="text-gold hover:text-gold-dark transition-colors">06 09 38 67 64</a></p>
                <p><strong className="text-terracotta font-medium">Email :</strong> <a href="mailto:contact@lesjardinsdelhacienda54.com" className="text-gold hover:text-gold-dark transition-colors">contact@lesjardinsdelhacienda54.com</a></p>
                <p><strong className="text-terracotta font-medium">Directeur de publication :</strong> <span className="bg-gold/15 text-gold-dark px-2 py-0.5 text-xs font-sans italic">[ à compléter ]</span></p>
              </div>
            </article>

            {/* 2. Hébergeur */}
            <article>
              <h2 className="font-heading font-semibold text-xl text-terracotta mb-4 pb-2 border-b border-terracotta/10">
                2. Hébergement
              </h2>
              <div className="space-y-2 font-sans text-base text-terracotta/70 leading-relaxed">
                <p><strong className="text-terracotta font-medium">Hébergeur :</strong> Vercel Inc.</p>
                <p><strong className="text-terracotta font-medium">Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
                <p><strong className="text-terracotta font-medium">Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-dark transition-colors">vercel.com</a></p>
              </div>
            </article>

            {/* 3. Propriété intellectuelle */}
            <article>
              <h2 className="font-heading font-semibold text-xl text-terracotta mb-4 pb-2 border-b border-terracotta/10">
                3. Propriété intellectuelle
              </h2>
              <div className="space-y-3 font-sans text-base text-terracotta/70 leading-relaxed">
                <p>
                  L&apos;ensemble des contenus présents sur ce site (textes, images, photographies, logos, vidéos, illustrations)
                  est la propriété exclusive de Les Jardins de l&apos;Hacienda ou de ses partenaires, et est protégé
                  par les lois françaises et internationales relatives à la propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des
                  éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l&apos;autorisation
                  préalable et écrite de Les Jardins de l&apos;Hacienda.
                </p>
              </div>
            </article>

            {/* 4. Données personnelles */}
            <article id="confidentialite">
              <h2 className="font-heading font-semibold text-xl text-terracotta mb-4 pb-2 border-b border-terracotta/10">
                4. Protection des données personnelles & Confidentialité
              </h2>
              <div className="space-y-3 font-sans text-base text-terracotta/70 leading-relaxed">
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
                  Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d&apos;un droit d&apos;accès,
                  de rectification, d&apos;effacement et de portabilité de vos données personnelles.
                </p>
                <p>
                  Les données collectées via les formulaires de contact et de réservation sont utilisées
                  exclusivement pour répondre à vos demandes et ne sont jamais cédées à des tiers.
                </p>
                <p>
                  Pour exercer vos droits ou pour toute question relative à la protection de vos données,
                  vous pouvez nous contacter à l&apos;adresse :{" "}
                  <a href="mailto:contact@lesjardinsdelhacienda54.com" className="text-gold hover:text-gold-dark transition-colors">
                    contact@lesjardinsdelhacienda54.com
                  </a>
                </p>
                <p>
                  Vous disposez également du droit d&apos;introduire une réclamation auprès de la
                  Commission Nationale de l&apos;Informatique et des Libertés (CNIL) :{" "}
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-dark transition-colors">
                    www.cnil.fr
                  </a>
                </p>
              </div>
            </article>

            {/* 5. Cookies & Données analytiques */}
            <article>
              <h2 className="font-heading font-semibold text-xl text-terracotta mb-4 pb-2 border-b border-terracotta/10">
                5. Cookies &amp; Données analytiques
              </h2>
              <div className="space-y-3 font-sans text-base text-terracotta/70 leading-relaxed">
                <p>
                  Ce site utilise des cookies techniques strictement nécessaires au bon
                  fonctionnement du site (mémorisation des préférences cookies, session).
                  Aucun cookie de tracking publicitaire n&apos;est utilisé.
                </p>
                <p>
                  <strong className="font-semibold text-terracotta">Plausible Analytics</strong> — Ce site utilise
                  Plausible Analytics, un outil de mesure d&apos;audience respectueux de la vie privée.
                  Plausible ne dépose <strong>aucun cookie</strong> sur votre navigateur, ne collecte pas
                  d&apos;identifiants personnels, et toutes les données sont agrégées et anonymes.
                  Plausible est conforme au RGPD par conception. En savoir plus :{" "}
                  <a href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer"
                    className="text-rouge hover:underline">plausible.io/privacy</a>.
                </p>
                <p>
                  <strong className="font-semibold text-terracotta">Google Maps</strong> — Ce site intègre
                  Google Maps pour vous permettre de localiser notre établissement. L&apos;affichage
                  de la carte Google Maps nécessite votre consentement préalable, car Google peut
                  déposer des cookies lors de l&apos;affichage de la carte. Vous pouvez accepter ou refuser
                  via la bannière cookies affichée lors de votre première visite.
                </p>
                <p>
                  Conformément à la réglementation en vigueur, vous pouvez retirer votre consentement
                  à tout moment en effaçant les données de votre navigateur pour ce site.
                </p>
              </div>
            </article>

            {/* 6. Responsabilité */}
            <article>
              <h2 className="font-heading font-semibold text-xl text-terracotta mb-4 pb-2 border-b border-terracotta/10">
                6. Limitation de responsabilité
              </h2>
              <div className="space-y-3 font-sans text-base text-terracotta/70 leading-relaxed">
                <p>
                  Les Jardins de l&apos;Hacienda s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour
                  des informations diffusées sur ce site. Cependant, nous ne pouvons garantir
                  l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à disposition.
                </p>
                <p>
                  Les horaires, tarifs et disponibilités affichés sont donnés à titre indicatif
                  et peuvent être modifiés sans préavis. Nous vous invitons à nous contacter
                  directement pour toute confirmation.
                </p>
              </div>
            </article>

            {/* 7. Droit applicable */}
            <article>
              <h2 className="font-heading font-semibold text-xl text-terracotta mb-4 pb-2 border-b border-terracotta/10">
                7. Droit applicable
              </h2>
              <div className="font-sans text-base text-terracotta/70 leading-relaxed">
                <p>
                  Le présent site et ses mentions légales sont soumis au droit français.
                  En cas de litige, les tribunaux français seront seuls compétents.
                </p>
              </div>
            </article>

            {/* Note */}
            <div className="border border-gold/20 bg-gold/5 p-6">
              <p className="font-sans text-xs text-terracotta/50 leading-relaxed">
                <strong className="text-gold">Note :</strong> Les champs surlignés doivent être renseignés avant mise en ligne
                renseignées par le propriétaire de l&apos;établissement avant la mise en ligne
                (SIRET, forme juridique, directeur de publication).
              </p>
            </div>

            {/* CTA retour */}
            <div className="pt-4">
              <Link href="/" className="btn-primary">
                ← Retour à l&apos;accueil
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
