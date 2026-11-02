import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  BookOpen,
  Check,
  ChevronDown,
  Cog,
  Droplets,
  Eye,
  Factory,
  Info,
  Instagram,
  Menu,
  MessageCircle,
  MapPin,
  Navigation,
  PhoneCall,
  Play,
  Search,
  Youtube,
  X,
  Zap,
} from "lucide-react";
import {
  ContactFactoryLocation,
  HomeFactoryLocation,
} from "./components/FactoryLocation";
import {
  createWhatsAppUrl,
  factoryLocation,
  factoryMapPlaceUrl,
} from "./data/factory";
import {
  findMatchingProducts,
  type PumpFinderCriteria,
  type PumpMatch,
} from "./data/pump-finder";
import {
  categories,
  categoryBySlug,
  productModelBySlug,
  products,
  type ProductGalleryView,
  type ProductModel,
} from "./data/products";
import { socialLinks } from "./data/social";
import ProductCatalogueDashboard from "./pages/catalogue-dashboard";

// Set this only after adding or verifying the official MAXBE PDF asset.
const officialCataloguePdfUrl: string | null = null;
const agricultureHomeVideoSrc = "/videos/maxbe-agriculture-home.mp4";
const agricultureHomePoster = "/videos/maxbe-agriculture-home-poster.jpg";

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand${footer ? " brand-footer" : ""}`}
      aria-label={
        footer ? "MAXBE Pumps home" : "MAXBE Pumps home — Low Voltage King"
      }
      data-testid="link-brand"
    >
      {footer ? (
        <>
          <img
            className="footer-brand-logo"
            src="/assets/maxbe-logo-transparent.png"
            alt=""
            loading="lazy"
          />
          <span className="footer-brand-tagline">LOW VOLTAGE KING</span>
        </>
      ) : (
        <>
          <span className="brand-logo-crop" aria-hidden="true">
            <img
              className="site-logo"
              src="/assets/maxbe-logo-transparent.png"
              alt=""
            />
          </span>
          <span className="brand-tagline">LOW VOLTAGE KING</span>
        </>
      )}
    </Link>
  );
}

function SocialLinks({ className }: { className: string }) {
  return (
    <div className={className} aria-label="MAXBE on social media">
      {socialLinks.map(({ label, url }) => {
        const Icon = label === "YouTube" ? Youtube : Instagram;
        return (
          <a
            key={label}
            className="social-action"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open MAXBE Pumps on ${label}`}
            title={label}
          >
            <Icon size={20} aria-hidden="true" />
            <span className="social-action-label">{label}</span>
          </a>
        );
      })}
    </div>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.82 9.82 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.893-9.884 2.64.001 5.12 1.03 6.985 2.897a9.825 9.825 0 0 1 2.892 6.99c-.003 5.45-4.438 9.885-9.887 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.89c-.001 2.096.547 4.142 1.588 5.946L0 24l6.335-1.662a11.933 11.933 0 0 0 5.71 1.453h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.41z" />
    </svg>
  );
}

function HomeHeroVideo() {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div
      className="hero-video-background"
      aria-hidden="true"
      style={{ backgroundImage: `url("${agricultureHomePoster}")` }}
    >
      {!videoFailed && (
        <video
          className={`hero-background-video${videoReady ? " is-ready" : ""}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={agricultureHomePoster}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        >
          <source src={agricultureHomeVideoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

function AgricultureVideoPanel() {
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = agricultureHomeVideoSrc !== null && !videoFailed;

  return (
    <div className="agriculture-film-panel">
      {showVideo ? (
        <video
          controls
          preload="none"
          playsInline
          poster={agricultureHomePoster}
          aria-label="Agricultural irrigation video"
          onError={() => setVideoFailed(true)}
        >
          <source src={agricultureHomeVideoSrc} type="video/mp4" />
          Your browser does not support HTML video.
        </video>
      ) : (
        <img
          src={agricultureHomePoster}
          alt="Agricultural irrigation field with sprinklers watering crops."
          loading="lazy"
        />
      )}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const productsTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
    setDropdown(null);
  }, [location]);
  const openFromKeyboard = (name: string) => {
    setDropdown(name);
    window.requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>(`[data-dropdown="${name}"] a`)
        ?.focus(),
    );
  };
  const closeDropdown = () => {
    const previous = dropdown;
    setDropdown(null);
    if (previous === "products") productsTrigger.current?.focus();
  };
  return (
    <>
      <header className="header">
        <nav className="nav" aria-label="Main navigation">
          <Brand />
          <div
            className={`navlinks ${open ? "open" : ""}`}
            onKeyDown={(event) => {
              if (event.key === "Escape" && dropdown) {
                event.preventDefault();
                closeDropdown();
              }
            }}
          >
            <Link href="/" className={location === "/" ? "active" : ""}>
              Home
            </Link>
            <Link
              href="/about"
              className={location === "/about" ? "active" : ""}
            >
              About Us
            </Link>
            <div className="nav-group">
              <button
                ref={productsTrigger}
                className={`nav-trigger ${location.startsWith("/products") ? "active" : ""}`}
                aria-expanded={dropdown === "products"}
                aria-controls="products-dropdown"
                onClick={() =>
                  setDropdown(dropdown === "products" ? null : "products")
                }
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    openFromKeyboard("products");
                  }
                }}
                data-testid="button-nav-products"
              >
                Products <ChevronDown size={14} />
              </button>
              {dropdown === "products" && (
                <div
                  className="nav-dropdown"
                  id="products-dropdown"
                  data-dropdown="products"
                  aria-label="Product categories"
                >
                  <Link href="/products" className="dropdown-feature">
                    All product categories <ArrowRight size={14} />
                  </Link>
                  {categories.map((category) => (
                    <Link
                      href={`/products?category=${category.slug}`}
                      key={category.slug}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/catalogue"
              className={location === "/catalogue" ? "active" : ""}
            >
              Catalogue
            </Link>
            <Link
              href="/find-a-dealer"
              className={location === "/find-a-dealer" ? "active" : ""}
            >
              Find a Dealer
            </Link>
            <Link
              href="/find-your-pump"
              className={location === "/find-your-pump" ? "active" : ""}
            >
              Find a Pump
            </Link>
            <Link
              href="/contact"
              className={location === "/contact" ? "active" : ""}
            >
              Contact Us
            </Link>
          </div>
          <a
            className="header-phone"
            href="tel:+919488353564"
            aria-label="Call MAXBE Pumps at 94883 53564"
          >
            <PhoneCall size={16} />
            94883 53564
          </a>
          <button
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => {
              setOpen(!open);
              if (open) setDropdown(null);
            }}
            data-testid="button-menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </nav>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Brand footer />
            <p>
              MAXBE Industries, Coimbatore — pump categories and product details
              from the public MAXBE reference website.
            </p>
            <SocialLinks className="footer-socials" />
          </div>
          <div className="footer-col">
            <h4>Our products</h4>
            {categories.map((category) => (
              <Link
                href={`/products?category=${category.slug}`}
                key={category.slug}
              >
                {category.name}
              </Link>
            ))}
            <Link href="/products">All products</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/find-a-dealer">Find a Dealer</Link>
            <Link href="/dealers">Become a Dealer</Link>
            <Link href="/catalogue">Catalogue</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/contact#enquiry-form">Get a Quote</Link>
            <Link href="/find-your-pump">Guided pump finder</Link>
          </div>
          <div className="footer-col footer-contact">
            <h4>Contact Us</h4>
            <a href="tel:+919488353564">94883 53564</a>
            <a href="tel:+919442573564">94425 73564</a>
            <a href="tel:+914222654185">0422-2654185 (Factory)</a>
            <address>
              {factoryLocation.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <a href={`mailto:${factoryLocation.email}`}>
              {factoryLocation.email}
            </a>
            <a href={`mailto:${factoryLocation.secondaryEmail}`}>
              {factoryLocation.secondaryEmail}
            </a>
            <span>{factoryLocation.businessHours}</span>
            <a
              href={factoryMapPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions <ArrowRight size={14} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} MAXBE INDUSTRIES · COIMBATORE
          </span>
          <a
            href="https://www.maxbepumps.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.maxbepumps.in
          </a>
        </div>
      </div>
    </footer>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const main = mainRef.current;
    if (
      !main ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const targets = Array.from(
      main.querySelectorAll<HTMLElement>(
        ".page-hero, main > section, main > nav.category-breadcrumb, main > .notfound",
      ),
    );
    const revealTargets = targets.flatMap((target) => {
      if (target.classList.contains("home-highlights")) {
        const panel = target.querySelector<HTMLElement>(
          ".home-highlights-grid",
        );
        return panel ? [panel] : [];
      }
      if (
        target.matches("section") &&
        target.querySelector(".home-highlights-grid")
      )
        return [];
      if (target.classList.contains("product-detail-section")) {
        return Array.from(
          target.querySelectorAll<HTMLElement>(
            ".product-detail-image,.category-detail-copy",
          ),
        );
      }
      return [target];
    });
    revealTargets.forEach((target, index) => {
      const motion = target.matches(".hero,.page-hero")
        ? "hero"
        : target.classList.contains("about-story-section") ||
            target.closest(".about-story-section")
          ? "story"
          : target.classList.contains("home-category-grid") ||
              target.closest(".home-category-grid")
            ? "supply"
            : target.classList.contains("product-detail-image")
              ? "detail-image"
              : target.classList.contains("category-detail-copy")
                ? "detail-copy"
                : target.classList.contains("catalogue-download-panel") ||
                    target.closest(".catalogue-page")
                  ? "catalogue"
                  : target.classList.contains("contact-enquiry-section")
                    ? "contact"
                    : target.classList.contains("band")
                      ? "next-step"
                      : "section";
      target.dataset.scrollReveal = motion;
      target.style.setProperty(
        "--scroll-reveal-delay",
        `${Math.min(index % 3, 2) * 55}ms`,
      );
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -7% 0px" },
    );
    revealTargets.forEach((target) => observer.observe(target));
    revealTargets.forEach((target) =>
      target.classList.add("scroll-reveal-ready"),
    );
    return () => {
      observer.disconnect();
      revealTargets.forEach((target) =>
        target.classList.remove("scroll-reveal-ready", "scroll-reveal-visible"),
      );
    };
  }, [location, children]);
  const routePath = location.split("?")[0];
  const selectedProductCategory =
    routePath === "/products"
      ? new URLSearchParams(window.location.search).get("category")
      : routePath.startsWith("/products/")
        ? (() => {
            const slug = routePath.slice("/products/".length);
            return (
              categoryBySlug(slug)?.slug ??
              productModelBySlug(slug)?.categorySlug ??
              null
            );
          })()
        : null;
  const waterScene =
    routePath === "/"
      ? "home"
      : selectedProductCategory
        ? selectedProductCategory
        : routePath === "/products"
          ? "products"
          : routePath === "/applications/agriculture"
            ? "agriculture"
            : routePath === "/about"
              ? "about"
              : routePath === "/contact" || routePath === "/dealers"
                ? "contact"
                : "default";
  const pageStyles = [
    location === "/about" && "ui-about",
    location === "/contact" && "ui-contact",
    location === "/catalogue" && "ui-catalogue",
    location === "/catalogue-dashboard" && "ui-catalogue-dashboard",
    location === "/find-a-dealer" && "ui-dealer-finder",
    (location === "/products" || location.startsWith("/products/")) &&
      "ui-products",
    (location === "/applications/agriculture" ||
      location === "/applications/domestic") &&
      "ui-application",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={`site ${pageStyles ? `ui-enhanced ${pageStyles}` : ""}`}>
      <div
        className={`water-background water-background--${waterScene}`}
        aria-hidden="true"
      />
      <Header />
      <main key={location.split("?")[0]} ref={mainRef} className="page-route">
        {children}
      </main>
      <Footer />
      <a
        className="site-whatsapp-float whatsapp-action"
        href={createWhatsAppUrl(
          "Hello MAXBE PUMPS, I would like to enquire about your pumps.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open WhatsApp chat with MAXBE Pumps"
      >
        <WhatsAppIcon size={27} />
        <span className="whatsapp-action-label" aria-hidden="true">
          WhatsApp
        </span>
      </a>
    </div>
  );
}

function Meta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} | MAXBE Pumps`;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", description);
  }, [title, description]);
  return null;
}

function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`eyebrow ${className}`.trim()}>{children}</div>;
}

function CategoryIcon({ categorySlug }: { categorySlug: string }) {
  const Icon =
    categorySlug === "openwell"
      ? Droplets
      : categorySlug === "v4-submersible"
        ? Zap
        : Cog;
  return <Icon size={20} strokeWidth={1.8} aria-hidden="true" />;
}

function PageHero({
  kicker,
  title,
  text,
  className = "",
  kickerClassName = "",
}: {
  kicker: string;
  title: string;
  text: string;
  className?: string;
  kickerClassName?: string;
}) {
  return (
    <section className={`page-hero ${className}`.trim()}>
      <div className="container">
        <Eyebrow className={kickerClassName}>{kicker}</Eyebrow>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}
function CTA({
  title,
  text,
  href = "/find-your-pump",
  label = "Find your pump",
}: {
  title: string;
  text: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="band">
      <div className="container band-inner">
        <div>
          <Eyebrow>THE NEXT STEP</Eyebrow>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Link className="btn" href={href}>
          {label}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function ProductVideoGallery() {
  return (
    <section
      className="section video-showcase-section"
      aria-labelledby="product-video-gallery-heading"
    >
      <div className="container section-head">
        <div>
          <h2 id="product-video-gallery-heading">
            MAXBE Product Video Gallery
          </h2>
        </div>
        <p>
          Genuine MAXBE product demonstration footage has not been supplied
          yet.
        </p>
      </div>
      <div className="container video-showcase-grid">
        {categories.map((category, index) => (
          <article className="video-category-card" key={category.slug}>
            <span className="video-category-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{category.name}</h3>
            <span className="video-category-rule" aria-hidden="true" />
            <p className="video-category-status">
              Product video coming soon
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Meta
        title="MAXBE PUMPS — Reliable Pumps"
        description="Explore MAXBE monoblock, open well submersible and V4 submersible pump products."
      />
      <section className="hero" aria-label="Hero section">
        <HomeHeroVideo />
        <div className="hero-inner animate-in">
          <div className="hero-copy">
            <img
              className="hero-brand-logo"
              src="/assets/maxbe-logo-transparent.png"
              alt="MAXBE PUMPS — Low Voltage King"
              fetchPriority="high"
            />
            <h1>Powering Every Drop. Supporting Every Harvest.</h1>
            <p>
              Reliable pumping solutions for agriculture, irrigation, water
              management and industry. Explore our available product ranges and
              find a useful starting point for your requirements.
            </p>
            <div className="hero-actions">
              <Link href="/find-a-dealer" className="btn">
                <MapPin size={16} aria-hidden="true" />
                FIND A DEALER
              </Link>
              <Link href="/find-your-pump" className="btn outline">
                <Search size={16} aria-hidden="true" />
                FIND A PUMP
              </Link>
            </div>
            <div className="hero-contact-strip">
              <a href={`mailto:${factoryLocation.email}`}>
                {factoryLocation.email}
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://www.maxbepumps.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.maxbepumps.in
              </a>
              <span aria-hidden="true">·</span>
              <a href="tel:+919488353564">94883 53564</a>
            </div>
          </div>
        </div>
      </section>
      <section
        className="home-highlights"
        aria-label="Explore the MAXBE website"
      >
        <div className="container home-highlights-grid">
          <div>
            <strong>{products.length}</strong>
            <span>listed pump models</span>
          </div>
          <div>
            <strong>{categories.length}</strong>
            <span>pump ranges</span>
          </div>
          <div>
            <strong>Since 1992</strong>
            <span>MAXBE Industries · Coimbatore</span>
          </div>
        </div>
      </section>
      <section
        className="section agriculture-film-section"
        aria-labelledby="agriculture-film-heading"
      >
        <div className="container">
          <div className="section-head agriculture-film-head">
            <div>
              <Eyebrow>AGRICULTURE &amp; IRRIGATION</Eyebrow>
              <h2 id="agriculture-film-heading">
                SMART WATER SOLUTIONS FOR AGRICULTURE
              </h2>
            </div>
            <p>
              Reliable water solutions for vegetable farms, agricultural
              irrigation, and everyday water management.
            </p>
          </div>
          <AgricultureVideoPanel />
        </div>
      </section>
      <section className="section">
        <div className="container section-head">
          <div>
            <Eyebrow>WHAT WE SUPPLY</Eyebrow>
            <h2>Our Product Categories</h2>
          </div>
          <p>
            Three pump ranges for water needs from domestic wells to deep
            borewells and agricultural fields.
          </p>
        </div>
        <div className="container tile-grid home-category-grid">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.categorySlug === category.slug,
            );
            return (
              <Link
                href={`/products?category=${category.slug}`}
                className="tile home-category-tile"
                key={category.slug}
              >
                <span className="home-category-image" aria-hidden="true">
                  <span className="category-visual-mark">
                    <Droplets size={34} strokeWidth={1.5} />
                  </span>
                  <span className="category-visual-label">
                    MAXBE PUMPS · PRODUCT RANGE
                  </span>
                </span>
                <span className="category-icon">
                  <CategoryIcon categorySlug={category.slug} />
                </span>
                <span className="tile-num">
                  {categoryProducts.length} listed models
                </span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="category-browse">
                  Browse This Range <ArrowRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <ProductVideoGallery />
      <section className="section water-needs-section">
        <div className="container">
          <div className="water-needs-card">
            <div className="water-needs-heading">
              <Eyebrow>PUMP SELECTION MADE SIMPLE</Eyebrow>
              <h2>Start with Your Water Needs</h2>
              <p>
                Choosing the right pumping solution starts with understanding
                your water source, delivery requirements, and intended
                application. These details help identify the most suitable
                options for further technical evaluation.
              </p>
            </div>
            <ul className="water-needs-list">
              {[
                {
                  icon: Droplets,
                  title: "Water source",
                  description:
                    "Borewell, open well, storage tank, or surface water.",
                },
                {
                  icon: Factory,
                  title: "Intended application",
                  description:
                    "Agriculture, irrigation, domestic water supply, or industrial use.",
                },
                {
                  icon: Activity,
                  title: "Delivery requirements",
                  description:
                    "Approximate height, distance, and required water flow.",
                },
                {
                  icon: Zap,
                  title: "Power availability",
                  description:
                    "Electrical supply and other relevant site requirements.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <li className="water-needs-item" key={title}>
                  <span className="water-needs-icon">
                    <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                </li>
              ))}
            </ul>
            <div className="water-needs-footer">
              <p>
                Share these details to make your product enquiry more useful.
                Our team can help review your requirements and guide you toward
                suitable products once the necessary technical specifications
                have been verified.
              </p>
              <Link className="btn" href="/find-your-pump">
                Find the Right Pump <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container section-head">
          <div>
            <Eyebrow>POPULAR MODELS</Eyebrow>
            <h2>Featured Products</h2>
          </div>
          <p>
            A selection from each category. Browse the full range and individual
            model details.
          </p>
        </div>
        <div className="container catalog-grid home-catalog-grid">
          {[products[0], products[3], products[6]].map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="container">
          <Link className="btn products-all-link" href="/products">
            View All Products <ArrowRight size={15} />
          </Link>
        </div>
      </section>
      <section className="section dealer-acquisition-section">
        <div className="container dealer-acquisition-card">
          <div className="dealer-acquisition-visual">
            <img
              src="/assets/maxbe-logo-transparent.png"
              alt="MAXBE Pumps"
              loading="lazy"
            />
            <span>LOW VOLTAGE KING</span>
          </div>
          <div className="dealer-acquisition-copy">
            <Eyebrow>BECOME A MAXBE PUMPS DEALER</Eyebrow>
            <h2>Grow Your Business with Maxbe Pumps</h2>
            <p>
              Are you a motor dealer, pump distributor, agricultural equipment
              supplier, or industrial products retailer? Connect with Maxbe
              Pumps to discuss a potential dealership opportunity and explore
              how our product range may fit your market.
            </p>
            <ul className="dealer-benefits">
              {[
                {
                  Icon: Cog,
                  text: "Explore the available motor and pump product range.",
                },
                {
                  Icon: BookOpen,
                  text: "Access product catalogues and technical information.",
                },
                {
                  Icon: MapPin,
                  text: "Discuss your local market and customer requirements.",
                },
                {
                  Icon: MessageCircle,
                  text: "Connect with the company team for enquiries.",
                },
                {
                  Icon: Factory,
                  text: "Explore potential business collaboration.",
                },
              ].map(({ Icon, text }) => (
                <li key={text}>
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className="dealer-acquisition-actions">
              <Link className="btn" href="/dealers#enquiry-form">
                Apply for Dealership <ArrowRight size={16} />
              </Link>
              <a
                className="dealer-whatsapp-link"
                href={createWhatsAppUrl(
                  "Hello MAXBE PUMPS, I would like to discuss a potential dealership opportunity.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={18} />
                WhatsApp dealer enquiry
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="section applications-section">
        <div className="container section-head">
          <div>
            <Eyebrow>WHERE WATER MATTERS</Eyebrow>
            <h2>Solutions for everyday applications.</h2>
          </div>
          <p>
            Explore common water-use contexts and the questions that help shape
            a product conversation.
          </p>
        </div>
        <div className="container application-cards">
          {[
            [
              "Agricultural irrigation",
              "Explore water movement for fields and irrigation systems.",
              "/applications/agriculture",
            ],
            [
              "Residential water supply",
              "Start with household storage, supply and daily water needs.",
              "/applications/domestic",
            ],
            [
              "Industrial light-duty pumping",
              "Review the published industrial light-duty application for the MB-1HP model.",
              "/products/maxbe-monoblock-1hp",
            ],
          ].map(([title, description, href]) => (
            <Link href={href} className="application-card" key={title}>
              <div>
                <span>APPLICATION GUIDE</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <b>
                  Explore application <ArrowRight size={15} />
                </b>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section why-section">
        <div className="container section-head">
          <div>
            <Eyebrow>WHY MAXBE PUMPS</Eyebrow>
            <h2>A helpful start for your water needs.</h2>
          </div>
          <p>
            Find listed pump ranges, review application guidance, and contact
            MAXBE to confirm product information for your requirements.
          </p>
        </div>
        <div className="container tile-grid why-maxbe-grid">
          {[
            {
              icon: Droplets,
              title: "Pump categories",
              text: "Browse the listed monoblock, open well submersible, and V4 submersible ranges.",
            },
            {
              icon: Search,
              title: "Application guidance",
              text: "Review water-source and application prompts before choosing a product.",
            },
            {
              icon: Info,
              title: "Product information",
              text: "Compare published model details and confirm specifications with MAXBE.",
            },
            {
              icon: MessageCircle,
              title: "Direct enquiry",
              text: "Contact MAXBE for product guidance and current availability.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article className="tile benefit-tile" key={title}>
              <span className="why-maxbe-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <HomeFactoryLocation />
      <CTA
        title="Need a pump? Let’s find the right one for you."
        text="Tell us about your application and water requirement. Contact MAXBE to check product information and availability."
        href="/contact#enquiry-form"
        label="Send an enquiry"
      />
      <section className="section tight">
        <div className="container notice">
          <b>Product information.</b> Model names and specifications shown here
          are reproduced from the public MAXBE reference website. Please confirm
          current specifications and availability with MAXBE before purchase.
        </div>
      </section>
    </>
  );
}

function ProductCard({
  product,
  finderMatch,
}: {
  product: ProductModel;
  finderMatch?: PumpMatch;
}) {
  const category = categoryBySlug(product.categorySlug);
  const whatsappUrl = createWhatsAppUrl(
    `Hello MAXBE PUMPS, I am interested in the ${product.name} (Model: ${product.model}). Please share more details and pricing.`,
  );
  return (
    <article className="product-card">
      <Link
        href={`/products/${product.slug}`}
        className="product-card-visual"
        aria-label={`View ${product.name} ${product.model}`}
      >
        <div className="home-product-image product-visual-placeholder">
          <span className="product-visual-mark" aria-hidden="true">
            <Cog size={40} strokeWidth={1.4} />
          </span>
          <span className="product-visual-kicker">MAXBE PUMPS · MODEL</span>
          <strong>{product.model}</strong>
          <span className="product-visual-note">Official product image not supplied</span>
        </div>
      </Link>
      <div className="product-body">
        <div className="category-kicker">
          {category?.icon} {category?.name}
        </div>
        <p className="product-model">Model: {product.model}</p>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-spec-highlights">
          <span>
            <small>Motor Power</small>
            <b>{product.motorPower}</b>
          </span>
          <span>
            <small>Max Head</small>
            <b>{product.maxHead}</b>
          </span>
        </div>
        {finderMatch && (
          <div className="finder-match-checks">
            {(["match", "mismatch", "unknown"] as const).map((status) => {
              const checks = finderMatch.checks.filter(
                (check) => check.status === status,
              );
              if (!checks.length) return null;
              return (
                <div className="finder-match-check-group" key={status}>
                  <strong>
                    {status === "match"
                      ? "Yes"
                      : status === "mismatch"
                        ? "No"
                        : "Check"}
                  </strong>
                  <ul>
                    {checks.map((check) => (
                      <li key={check.label}>
                        <b>{check.label}:</b> {check.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
        <div className="product-card-actions">
          <Link
            className="btn product-view-link"
            href={`/products/${product.slug}`}
          >
            <Eye size={16} aria-hidden="true" />
            View Details
          </Link>
          <a
            className="quote-link whatsapp-enquiry"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enquire <WhatsAppIcon size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}

const requiredProductViews: ProductGalleryView["label"][] = [
  "Top",
  "Front",
  "Left",
  "Right",
];

function ProductGallery({ product }: { product: ProductModel }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const galleryViews =
    product.galleryViews?.length &&
    requiredProductViews.every((label) =>
      product.galleryViews?.some((view) => view.label === label),
    )
      ? product.galleryViews
      : null;
  const selectedView = galleryViews
    ? galleryViews[selectedIndex] ?? galleryViews[0]
    : null;

  return (
    <figure className="category-detail-image product-detail-image product-gallery">
      {galleryViews && selectedView ? (
        <>
          <img
            className="product-gallery-main-image"
            key={selectedView.image}
            src={selectedView.image}
            alt={selectedView.alt}
            fetchPriority="high"
          />
          <div
            className="product-gallery-thumbnails"
            role="group"
            aria-label={`${product.model} product image views`}
          >
            {galleryViews.map((view, index) => (
              <button
                key={view.label}
                type="button"
                className={`product-gallery-thumbnail${selectedIndex === index ? " is-active" : ""}`}
                aria-pressed={selectedIndex === index}
                aria-label={`Show ${view.label.toLowerCase()} view of ${product.model}`}
                onClick={() => setSelectedIndex(index)}
              >
                <img src={view.image} alt="" loading="lazy" />
                <span>{view.label}</span>
              </button>
            ))}
          </div>
          <figcaption aria-live="polite">{selectedView.label} view</figcaption>
        </>
      ) : (
        <div className="product-visual-placeholder product-detail-placeholder">
          <span className="product-visual-mark" aria-hidden="true">
            <Cog size={52} strokeWidth={1.25} />
          </span>
          <span className="product-visual-kicker">
            MAXBE PUMPS · {product.model}
          </span>
          <strong>{product.name}</strong>
          <span className="product-visual-note">
            Official product photography has not been supplied.
          </span>
        </div>
      )}
    </figure>
  );
}

function CategoryRangeNavigation({ currentSlug }: { currentSlug: string }) {
  const currentIndex = categories.findIndex(
    (category) => category.slug === currentSlug,
  );
  if (currentIndex < 0) return null;
  const previous = categories[(currentIndex + categories.length - 1) % categories.length];
  const next = categories[(currentIndex + 1) % categories.length];

  return (
    <nav className="category-range-navigation" aria-label="Product range navigation">
      <a
        href={`/products?category=${previous.slug}`}
        aria-label={`Previous product range: ${previous.name}`}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        <span>
          <small>Previous range</small>
          {previous.name}
        </span>
      </a>
      <a className="category-range-all" href="/products">
        All product ranges
      </a>
      <a
        href={`/products?category=${next.slug}`}
        aria-label={`Next product range: ${next.name}`}
      >
        <span>
          <small>Next range</small>
          {next.name}
        </span>
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    </nav>
  );
}

function Products() {
  const [location] = useLocation();
  const selectedCategory = new URLSearchParams(
    window.location.search,
  ).get("category");
  const initialFilter =
    selectedCategory &&
    categories.some((category) => category.slug === selectedCategory)
      ? selectedCategory
      : "all";
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(initialFilter);
  useEffect(() => setFilter(initialFilter), [initialFilter, location]);
  const shown = products.filter((product) => {
    const category = categoryBySlug(product.categorySlug);
    const matchesText =
      `${product.name} ${product.model} ${product.description} ${category?.name ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
    return matchesText && (filter === "all" || product.categorySlug === filter);
  });
  const setCategory = (category: string) => setFilter(category);
  return (
    <>
      <Meta
        title="Product Catalogue"
        description="Browse MAXBE monoblock, open well submersible and V4 submersible pump models."
      />
      <PageHero
        kicker="COMPLETE RANGE"
        title="Product Catalogue"
        text="Browse monoblock, open well submersible and V4 borewell pump models."
      />
      <section className="section product-listing-section">
        <div className="container">
          {filter !== "all" && (
            <CategoryRangeNavigation currentSlug={filter} />
          )}
          <div className="catalog-tools">
            <label className="searchbox">
              <Search size={18} />
              <input
                aria-label="Search products"
                placeholder="Search products…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div
              className="product-category-filters"
              role="group"
              aria-label="Category filters"
            >
              <button
                type="button"
                className={filter === "all" ? "active" : ""}
                onClick={() => setCategory("all")}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.slug}
                  className={filter === category.slug ? "active" : ""}
                  onClick={() => setCategory(category.slug)}
                >
                  <CategoryIcon categorySlug={category.slug} />
                  {category.name}
                </button>
              ))}
            </div>
            <p className="product-result-count" aria-live="polite">
              {shown.length} {shown.length === 1 ? "product" : "products"}
            </p>
          </div>
          <div className="catalog-grid">
            {shown.length ? (
              shown.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))
            ) : (
              <div className="empty">
                No products match your search. Try another model or category.
              </div>
            )}
          </div>
        </div>
      </section>
      <DealerPrompt />
    </>
  );
}

function DealerPrompt() {
  return (
    <section className="section dealer-prompt-section">
      <div className="container dealer-prompt">
        <div>
          <Eyebrow>DEALER ENQUIRIES</Eyebrow>
          <h2>Interested in offering MAXBE pump ranges?</h2>
          <p>
            Share your business type, location and product interests to start a
            discussion with the MAXBE team.
          </p>
        </div>
        <Link className="btn" href="/dealers#enquiry-form">
          Become a Dealer <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function ProductDetail({ params }: { params: { slug?: string } }) {
  const product = params.slug ? productModelBySlug(params.slug) : undefined;
  if (!product) {
    const category = params.slug ? categoryBySlug(params.slug) : undefined;
    if (!category) return <NotFound />;
    const categoryProducts = products.filter(
      (item) => item.categorySlug === category.slug,
    );
    return (
      <>
        <Meta
          title={category.name}
          description={`${category.name} pump models in the MAXBE product catalogue.`}
        />
        <PageHero
          kicker="PRODUCT RANGE"
          title={category.name}
          text={category.description}
        />
        <section className="section category-product-range-section">
          <div className="container">
            <CategoryRangeNavigation currentSlug={category.slug} />
            <div className="category-range-heading">
              <span className="category-icon">
                <CategoryIcon categorySlug={category.slug} />
              </span>
              <div>
                <Eyebrow>PRODUCT RANGE</Eyebrow>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
              </div>
            </div>
            <div className="catalog-grid">
              {categoryProducts.map((item) => (
                <ProductCard product={item} key={item.slug} />
              ))}
            </div>
          </div>
        </section>
        <DealerPrompt />
      </>
    );
  }
  const category = categoryBySlug(product.categorySlug);
  if (!category) return <NotFound />;
  const whatsappUrl = createWhatsAppUrl(
    `Hello MAXBE PUMPS, I am interested in the ${product.name} (Model: ${product.model}). Please share more details and pricing.`,
  );
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const expandedActionRef = useRef<string | null>(null);
  const pendingTouchActivation = useRef<string | null>(null);
  const related = products.filter(
    (item) =>
      item.categorySlug === product.categorySlug && item.slug !== product.slug,
  );
  const handleActionPointerDown = (
    action: string,
    pointerType: string,
  ) => {
    if (pointerType !== "touch") return;
    if (expandedActionRef.current === action) {
      pendingTouchActivation.current = null;
      return;
    }

    expandedActionRef.current = action;
    pendingTouchActivation.current = action;
    setExpandedAction(action);
  };
  const handleActionBlur = (action: string) => {
    if (expandedActionRef.current !== action) return;
    expandedActionRef.current = null;
    setExpandedAction(null);
  };
  const handleActionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    action: string,
  ) => {
    if (pendingTouchActivation.current !== action) return;
    pendingTouchActivation.current = null;
    event.preventDefault();
  };
  return (
    <>
      <Meta
        title={`${product.name} ${product.model}`}
        description={`${product.name}, model ${product.model}. ${product.description}`}
      />
      <nav className="container category-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/products">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${category.slug}`}>
          {category.name}
        </Link>
        <span>/</span>
        <span aria-current="page">{product.model}</span>
      </nav>
      <div className="container product-detail-range-nav">
        <CategoryRangeNavigation currentSlug={category.slug} />
      </div>
      <section className="section product-detail-section">
        <div className="container product-detail-layout">
          <ProductGallery key={product.slug} product={product} />
          <div className="category-detail-copy">
            <article className="product-detail-summary">
              <span className="category-kicker">
                <CategoryIcon categorySlug={category.slug} />
                {category.name}
              </span>
              <h1>{product.name}</h1>
              <p className="product-detail-model">Model: {product.model}</p>
              <p>{product.description}</p>
              <h2>Technical Specifications</h2>
              <div className="product-detail-specs">
                {(
                  product.specifications ?? [
                    { label: "Motor Power", value: product.motorPower },
                    { label: "Max Head", value: product.maxHead },
                  ]
                ).map((spec) => (
                  <div className="product-specification" key={spec.label}>
                    <span>{spec.label}</span>
                    <strong>{spec.value}</strong>
                  </div>
                ))}
              </div>
              {product.features && (
                <>
                  <h2>Key Features</h2>
                  <ul className="product-feature-list">
                    {product.features.map((feature) => (
                      <li key={feature}>
                        <Check size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {product.applications && (
                <>
                  <h2>Suitable For</h2>
                  <div className="product-application-chips">
                    {product.applications.map((application) => (
                      <span key={application}>{application}</span>
                    ))}
                  </div>
                </>
              )}
              <div className="product-detail-actions">
                <a
                  className={`btn whatsapp-enquiry product-action-icon-button action-whatsapp${expandedAction === "whatsapp" ? " is-expanded" : ""}`}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerDown={(event) =>
                    handleActionPointerDown("whatsapp", event.pointerType)
                  }
                  onBlur={() => handleActionBlur("whatsapp")}
                  onClick={(event) => handleActionClick(event, "whatsapp")}
                >
                  <WhatsAppIcon size={18} />
                  <span className="product-action-label">WhatsApp Enquiry</span>
                </a>
                <a
                  className={`btn outline product-action-icon-button action-call${expandedAction === "call" ? " is-expanded" : ""}`}
                  href="tel:+919488353564"
                  onPointerDown={(event) =>
                    handleActionPointerDown("call", event.pointerType)
                  }
                  onBlur={() => handleActionBlur("call")}
                  onClick={(event) => handleActionClick(event, "call")}
                >
                  <PhoneCall size={16} aria-hidden="true" />
                  <span className="product-action-label">Call Us</span>
                </a>
                <span
                  className="product-detail-action-break"
                  aria-hidden="true"
                />
                <a
                  className={`btn outline product-video-link product-video-button product-action-icon-button action-video${expandedAction === "video" ? " is-expanded" : ""}`}
                  href="https://youtu.be/oVi2zkgylWo?si=g3-Q_1wx1seD_iJB"
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerDown={(event) =>
                    handleActionPointerDown("video", event.pointerType)
                  }
                  onBlur={() => handleActionBlur("video")}
                  onClick={(event) => handleActionClick(event, "video")}
                >
                  <Play
                    size={16}
                    fill="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="product-action-label">
                    Play Product Video
                  </span>
                </a>
              </div>
              <p className="product-reference-note">
                Specifications and product information are shown as published on
                the public MAXBE reference website. Confirm before purchase.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="section product-quote-section" id="request-quote">
        <div className="container">
          <div className="section-head">
            <div>
              <Eyebrow>ENQUIRE ABOUT THIS MODEL</Eyebrow>
              <h2>Request a Quote</h2>
            </div>
            <p>
              Prepare a product-specific email enquiry draft using your device.
            </p>
          </div>
          <ContactForm initialProduct={product.slug} />
        </div>
      </section>
      <DealerPrompt />
      {related.length > 0 && (
        <section className="section related-products-section">
          <div className="container">
            <div className="section-head">
              <div>
                <Eyebrow>MORE IN THIS RANGE</Eyebrow>
                <h2>Related Products</h2>
              </div>
              <p>Other models in {category.name}.</p>
            </div>
            <div className="catalog-grid">
              {related.map((item) => (
                <ProductCard product={item} key={item.slug} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Catalogue() {
  return (
    <>
      <Meta
        title="MAXBE Product Catalogue"
        description="Browse listed MAXBE pump ranges and check availability of the official product catalogue PDF."
      />
      <PageHero
        kicker="PRODUCT RANGE"
        title="MAXBE Catalogue"
        text="Explore the pump categories currently listed on this website."
      />
      <section className="section catalogue-page">
        <div className="container">
          <div className="catalogue-download-panel">
            <div className="catalogue-preview" aria-hidden="true">
              <img src="/assets/maxbe-logo-transparent.png" alt="" loading="lazy" />
              <span>PRODUCT RANGE</span>
              <strong>Catalogue</strong>
              <small>Official brochure not supplied</small>
            </div>
            <div className="catalogue-download-copy">
              <Eyebrow>OFFICIAL PRODUCT BROCHURE</Eyebrow>
              <h2>
                {officialCataloguePdfUrl
                  ? "MAXBE Product Catalogue"
                  : "Catalogue PDF currently unavailable"}
              </h2>
              <p>
                {officialCataloguePdfUrl
                  ? "Open or download the official MAXBE product catalogue."
                  : "The official MAXBE brochure PDF has not been supplied for this website. No placeholder or generated file is presented as the brochure. Browse the listed pump ranges or contact MAXBE to request verified catalogue information."}
              </p>
              {officialCataloguePdfUrl ? (
                <a
                  className="btn"
                  href={officialCataloguePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  Download Catalogue PDF <ArrowRight size={16} />
                </a>
              ) : (
                <a
                  className="btn"
                  href={`mailto:${factoryLocation.email}?subject=${encodeURIComponent("Request for MAXBE product catalogue")}`}
                >
                  Request Catalogue Availability <ArrowRight size={16} />
                </a>
              )}
            </div>
          </div>
          <div className="catalogue-page-grid">
            {categories.map((category, index) => {
              const categoryProducts = products.filter(
                (product) => product.categorySlug === category.slug,
              );
              return (
                <article className="catalogue-page-card" key={category.slug}>
                  <div className="catalogue-range-visual" aria-hidden="true">
                    <span>MAXBE PUMPS · RANGE / 0{index + 1}</span>
                    <Droplets size={34} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="catalogue-page-index">
                      RANGE / 0{index + 1}
                    </span>
                    <h2>{category.name}</h2>
                    <p>{category.description}</p>
                    <p className="catalogue-model-count">
                      {categoryProducts.length} listed models
                    </p>
                    <Link
                      className="text-link"
                      href={`/products?category=${category.slug}`}
                    >
                      Browse This Range <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <DealerPrompt />
    </>
  );
}

function Application({ kind }: { kind: "agriculture" | "domestic" }) {
  const farm = kind === "agriculture";
  return (
    <>
      <Meta
        title={farm ? "Agricultural applications" : "Domestic applications"}
        description={`Explore water-pump considerations for ${farm ? "agriculture and irrigation" : "household water management"} with MAXBE Pumps.`}
      />
      <PageHero
        kicker={farm ? "APPLICATION · AGRICULTURE" : "APPLICATION · DOMESTIC"}
        title={
          farm
            ? "Water is part of every field decision."
            : "Water for the everyday rhythm of home."
        }
        text={
          farm
            ? "For irrigation, crop water management and farm use, the right starting point is understanding the water source and where it needs to travel."
            : "For a home, begin with the water source, storage arrangement and the places water needs to reach."
        }
      />
      <section className="section">
        <div className="container split">
          <div className="story-panel application-note">
            <Eyebrow>{farm ? "FIELD CHECKLIST" : "HOME CHECKLIST"}</Eyebrow>
            <h3>
              {farm ? "Information to gather" : "Household details to note"}
            </h3>
            <ul>
              {(farm
                ? [
                    "Water source and seasonal variation",
                    "Where water needs to travel",
                    "Approximate requirement and lifting height, if known",
                  ]
                : [
                    "Water source and storage arrangement",
                    "Floors, tanks or fixtures to be supplied",
                    "Approximate height and daily use, if known",
                  ]
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <span className="status">
              Planning guidance only · confirm requirements with a qualified
              professional
            </span>
          </div>
          <div className="story-copy">
            <Eyebrow>{farm ? "FIELD TO SOURCE" : "SOURCE TO TAP"}</Eyebrow>
            <h2>
              {farm
                ? "Start with the source. Then map the route."
                : "A useful first conversation starts at home."}
            </h2>
            <p>
              {farm
                ? "Borewell, open well, surface water or a storage tank: each source raises different questions. Note your approximate water requirement and lifting height if you know them."
                : "Consider where water comes from, whether there is a tank or sump, and which floors or fixtures need supply. Approximate height and usage can help a qualified professional understand the setup."}
            </p>
            <p>
              These pages offer general planning prompts only. MAXBE product
              range and specifications are awaiting official confirmation.
            </p>
            <Link href="/find-your-pump" className="btn">
              Start the preliminary finder <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "#f0ece2" }}>
        <div className="container section-head">
          <div>
            <Eyebrow>THREE THINGS TO NOTE</Eyebrow>
            <h2>Bring useful context to the conversation.</h2>
          </div>
          <p>
            Unknown is a valid answer. A qualified professional should verify
            every installation requirement.
          </p>
        </div>
        <div className="container tile-grid">
          {(farm
            ? [
                [
                  "01",
                  "Water source",
                  "Borewell, open well, surface water or storage.",
                ],
                [
                  "02",
                  "Where it goes",
                  "Distance, height and irrigation layout, if known.",
                ],
                [
                  "03",
                  "Power available",
                  "Single-phase, three-phase, solar or not sure.",
                ],
              ]
            : [
                [
                  "01",
                  "Water source",
                  "Municipal, borewell, tank, sump or another source.",
                ],
                [
                  "02",
                  "Building layout",
                  "Floors, tank position and approximate height.",
                ],
                [
                  "03",
                  "Daily use",
                  "Household needs and times of highest demand.",
                ],
              ]
          ).map(([n, t, d]) => (
            <div className="tile" key={n}>
              <span className="tile-num">{n} / NOTE</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <CTA
        title="Take what you know. Leave the rest blank."
        text="The finder accepts unknown flow and head values and offers only a preliminary category direction."
      />
    </>
  );
}

type FinderOption = [string, string, string];
type FinderStep = {
  title: string;
  subtitle: string;
  options: FinderOption[];
};
type FinderAnswers = Record<number, string>;

const finderSteps: FinderStep[] = [
  {
    title: "What is the application?",
    subtitle: "Choose the main use for this pump.",
    options: [
      ["agricultural", "Agricultural", "Farms and irrigation"],
      ["domestic", "Domestic", "Household water supply"],
      ["industrial", "Industrial", "Industrial water requirements"],
      ["other", "Other", "A different or not-yet-defined application"],
    ],
  },
  {
    title: "Which pump category are you interested in?",
    subtitle: "Choose a range, or select Not sure for help comparing.",
    options: [
      ["monoblock", "Monoblock Pumps", "Surface-mounted pump range"],
      ["openwell", "Open Well Submersible", "For open well pump enquiries"],
      [
        "v4-submersible",
        "V4 Submersible Pumps",
        "4-inch submersible pump range",
      ],
      ["unsure", "Not sure — help me choose", "Compare available information"],
    ],
  },
  {
    title: "What is your water source?",
    subtitle: "Choose the closest match.",
    options: [
      ["open-well", "Open well", "Water from an open well"],
      ["borewell", "Borewell", "Water from a borewell"],
      ["water-tank", "Water tank", "Stored water"],
      ["other", "Other", "Another or currently unknown source"],
    ],
  },
  {
    title: "What is your requirement?",
    subtitle: "Choose the outcome you need the pump to support.",
    options: [
      ["irrigation", "Water for irrigation", "Farm or field water use"],
      [
        "domestic-supply",
        "Domestic water supply",
        "Water supply for a home",
      ],
      [
        "industrial-supply",
        "Industrial water supply",
        "Water supply for industrial use",
      ],
      ["other", "Other", "Another or not-yet-defined requirement"],
    ],
  },
  {
    title: "What motor power are you considering?",
    subtitle: "Choose an approximate horsepower, or leave this to MAXBE.",
    options: [
      ["0.5", "0.5 HP", "Half horsepower"],
      ["1", "1 HP", "One horsepower"],
      ["2", "2 HP", "Two horsepower"],
      ["3", "3 HP", "Three horsepower"],
      ["unsure", "Not sure", "Compare all listed motor powers"],
    ],
  },
  {
    title: "What head do you need?",
    subtitle: "Select an approximate minimum head in metres, if known.",
    options: [
      ["15", "At least 15 m", "Minimum head you hope to achieve"],
      ["30", "At least 30 m", "Minimum head you hope to achieve"],
      ["60", "At least 60 m", "Minimum head you hope to achieve"],
      ["61", "Above 60 m", "High head requirement"],
      ["unsure", "Not sure", "Ask MAXBE to help confirm"],
    ],
  },
  {
    title: "What discharge do you need?",
    subtitle: "Select an approximate minimum flow in litres per minute, if known.",
    options: [
      ["15", "At least 15 LPM", "Minimum flow you hope to achieve"],
      ["30", "At least 30 LPM", "Minimum flow you hope to achieve"],
      ["50", "At least 50 LPM", "Minimum flow you hope to achieve"],
      ["61", "Above 60 LPM", "High flow requirement"],
      ["unsure", "Not sure", "Ask MAXBE to help confirm"],
    ],
  },
];

function Finder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FinderAnswers>({});
  const [error, setError] = useState("");
  const done = step >= finderSteps.length;
  const current = finderSteps[Math.min(step, finderSteps.length - 1)];
  const progress = done ? 100 : Math.round((step / finderSteps.length) * 100);
  const finderCriteria: PumpFinderCriteria = {
    application: answers[0] ?? "",
    category: answers[1] ?? "",
    source: answers[2] ?? "",
    requirement: answers[3] ?? "",
    horsepower: answers[4] ?? "",
    head: answers[5] ?? "",
    discharge: answers[6] ?? "",
  };
  const restart = () => {
    setAnswers({});
    setError("");
    setStep(0);
  };
  const next = () => {
    if (!answers[step]) {
      setError("Choose an answer to continue.");
      return;
    }
    setError("");
    setStep(step + 1);
  };
  const matchingProducts = done ? findMatchingProducts(finderCriteria) : [];
  const finderWhatsAppUrl = createWhatsAppUrl(
    `Hello MAXBE PUMPS, I used the pump finder and need help confirming a suitable model. ${finderSteps
      .map(
        (item, index) =>
          `${item.title} ${item.options.find(([value]) => value === answers[index])?.[1] ?? "Not sure"}`,
      )
      .join("; ")}. Please contact me for technical confirmation.`,
  );

  return (
    <>
      <Meta
        title="Find your pump"
        description="Answer questions about your pump use, type, motor power, head and discharge to compare MAXBE models using published information."
      />
      <PageHero
        kicker="PRELIMINARY PRODUCT FINDER"
        title="Find a pump for your water requirement."
        text="Share your application, water source, pump type, motor power, head and flow needs. Results compare only the product information currently listed on this website."
      />
      <section className="section">
        <div className="container finder">
          <aside className="finder-rail">
            <h3>Your pump requirements</h3>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p className="finder-progress-copy">
              {done ? "Complete" : `STEP ${step + 1} OF ${finderSteps.length}`}{" "}
              · {progress}%
            </p>
            <ol className="step-list">
              {finderSteps.map((item, index) => (
                <li
                  className={index === step ? "current" : ""}
                  key={item.title}
                >
                  <b>{index < step ? <Check size={13} /> : index + 1}</b>
                  {item.title}
                </li>
              ))}
            </ol>
            <button
              onClick={restart}
              className="text-link"
              style={{
                background: "none",
                border: 0,
                cursor: "pointer",
                color: "#F4B323",
                padding: 0,
                marginTop: 28,
              }}
            >
              Restart finder <ArrowRight size={14} />
            </button>
          </aside>
          <div className="finder-panel">
            {!done ? (
              <>
                <Eyebrow>
                  QUESTION {step + 1} / {finderSteps.length}
                </Eyebrow>
                <h2>{current.title}</h2>
                <p>{current.subtitle}</p>
                <div className="option-grid">
                  {current.options.map(([value, label, detail]) => (
                    <button
                      key={value}
                      onClick={() => {
                        setAnswers({ ...answers, [step]: value });
                        setError("");
                      }}
                      className={`option ${answers[step] === value ? "selected" : ""}`}
                      aria-pressed={answers[step] === value}
                    >
                      <span>
                        {label}
                        <small>{detail}</small>
                      </span>
                      {answers[step] === value && <Check size={17} />}
                    </button>
                  ))}
                </div>
                {error && (
                  <p role="alert" style={{ color: "#C91D28", marginTop: 15 }}>
                    {error}
                  </p>
                )}
                <div className="finder-actions">
                  {step > 0 ? (
                    <button
                      className="btn outline"
                      onClick={() => {
                        setStep(step - 1);
                        setError("");
                      }}
                    >
                      <ArrowLeft size={15} /> Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <button className="btn" onClick={next}>
                    Continue <ArrowRight size={15} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Eyebrow>CLOSEST MATCHES</Eyebrow>
                <h2>Matching Pump Models</h2>
                <p>
                  These products are ranked by how closely their published
                  information matches your answers. A missing or mismatched
                  specification is called out on each result.
                </p>
                <div className="notice">
                  The listed data does not include full pump curves or every
                  model-specific flow specification. Results are preliminary
                  comparisons, not a guarantee of pump suitability.{" "}
                  <strong>
                    Please contact MAXBE for technical confirmation.
                  </strong>
                </div>
                <div className="catalog-grid finder-results">
                  {matchingProducts.map((match) => (
                    <ProductCard
                      product={match.product}
                      finderMatch={match}
                      key={match.product.slug}
                    />
                  ))}
                </div>
                <div className="finder-actions">
                  <button className="btn outline" onClick={restart}>
                    Start again
                  </button>
                  <a
                    className="btn whatsapp-enquiry"
                    href={finderWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon size={16} />
                    Ask MAXBE on WhatsApp
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactForm({
  dealer = false,
  initialProduct = "",
}: {
  dealer?: boolean;
  initialProduct?: string;
}) {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const fieldPrefix = dealer ? "dealer" : "contact";
  useEffect(() => setSelectedProduct(initialProduct), [initialProduct]);
  const selectedModel = products.find(
    (product) => product.slug === selectedProduct,
  );
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const emailInput = form.elements.namedItem("email");
    const businessName = String(data.get("businessName") ?? "").trim();
    const city = String(data.get("city") ?? "").trim();
    const state = String(data.get("state") ?? "").trim();
    const businessType = String(data.get("businessType") ?? "").trim();
    const businessExperience = String(
      data.get("businessExperience") ?? "",
    ).trim();
    const expectedRequirements = String(
      data.get("expectedRequirements") ?? "",
    ).trim();
    const dealerCategories = data
      .getAll("dealerCategories")
      .map((value) => String(value));
    const phoneDigits = phone.replace(/\D/g, "");
    if (
      !name ||
      !phone ||
      phoneDigits.length < 8 ||
      phoneDigits.length > 15 ||
      !message ||
      (dealer && !email) ||
      (dealer &&
        (!businessName ||
          !city ||
          !state ||
          !businessType ||
          dealerCategories.length === 0)) ||
      !(emailInput instanceof HTMLInputElement) ||
      !emailInput.checkValidity()
    ) {
      setError(
        dealer
          ? "Enter your name, business name, valid phone number, valid email, city, state, business type and message; select at least one product category."
          : "Enter your name, a valid phone number and message. If provided, check that your email address is valid.",
      );
      setNotice("");
      return;
    }
    const subject = dealer
      ? "Dealer enquiry"
      : selectedModel
        ? `Quote request: ${selectedModel.model}`
        : "MAXBE Pumps enquiry";
    const details = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : "",
      selectedModel
        ? `Product: ${selectedModel.name} (${selectedModel.model})`
        : "",
      dealer ? `Business: ${businessName}` : "",
      dealer ? `City: ${city}` : "",
      dealer ? `State: ${state}` : "",
      dealer ? `Business type: ${businessType}` : "",
      dealer && businessExperience
        ? `Existing business experience: ${businessExperience}`
        : "",
      dealer && expectedRequirements
        ? `Estimated business requirements / order volume: ${expectedRequirements}`
        : "",
      dealer
        ? `Interested product categories: ${dealerCategories.join(", ")}`
        : "",
      "",
      message,
    ]
      .filter((line) => line)
      .join("\n");
    setError("");
    setNotice(
      "If your device supports email links, an enquiry draft should open. The website has not sent your request; review and send it in your email application.",
    );
    window.location.href = `mailto:${factoryLocation.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(details)}`;
  };
  return (
    <form className="form-card" onSubmit={submit} noValidate>
      {error && (
        <div
          className="notice"
          role="alert"
          style={{ borderLeftColor: "#C91D28", marginBottom: 18 }}
        >
          {error}
        </div>
      )}
      {notice && (
        <div className="notice" role="status">
          {notice} If no draft opens, email{" "}
          <a href={`mailto:${factoryLocation.email}`}>
            {factoryLocation.email}
          </a>
          .
        </div>
      )}
      <div className="form-grid">
        <div className="field">
          <label htmlFor={`${fieldPrefix}-name`}>Full Name *</label>
          <input
            id={`${fieldPrefix}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
          />
        </div>
        <div className="field">
          <label htmlFor={`${fieldPrefix}-phone`}>Mobile Number *</label>
          <input
            id={`${fieldPrefix}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            placeholder="94883 53564"
          />
        </div>
        {dealer && (
          <div className="field wide">
            <label htmlFor="dealer-business-name">
              Company or Business Name *
            </label>
            <input
              id="dealer-business-name"
              name="businessName"
              required
              autoComplete="organization"
              placeholder="Your business name"
            />
          </div>
        )}
        <div className="field wide">
          <label htmlFor={`${fieldPrefix}-email`}>
            Email Address{dealer ? " *" : " (optional)"}
          </label>
          <input
            id={`${fieldPrefix}-email`}
            name="email"
            type="email"
            required={dealer}
            autoComplete="email"
            placeholder="your@email.com"
          />
        </div>
        {dealer ? (
          <>
            <div className="field">
              <label htmlFor="dealer-city">City *</label>
              <input
                id="dealer-city"
                name="city"
                required
                autoComplete="address-level2"
                placeholder="City"
              />
            </div>
            <div className="field">
              <label htmlFor="dealer-state">State *</label>
              <input
                id="dealer-state"
                name="state"
                required
                autoComplete="address-level1"
                placeholder="State"
              />
            </div>
            <div className="field wide">
              <label htmlFor="dealer-business-type">Business Type *</label>
              <select
                id="dealer-business-type"
                name="businessType"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select business type
                </option>
                {[
                  "Motor dealer",
                  "Pump distributor",
                  "Agricultural equipment supplier",
                  "Retailer",
                  "Industrial products supplier",
                  "Other",
                ].map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <fieldset className="field wide dealer-category-field">
              <legend>Product Categories of Interest *</legend>
              <div className="dealer-category-options">
                {categories.map((category) => (
                  <label key={category.slug}>
                    <input
                      type="checkbox"
                      name="dealerCategories"
                      value={category.name}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field wide">
              <label htmlFor="dealer-business-experience">
                Existing Business Experience (optional)
              </label>
              <textarea
                id="dealer-business-experience"
                name="businessExperience"
                rows={3}
                placeholder="Briefly describe your experience, if relevant."
              />
            </div>
            <div className="field wide">
              <label htmlFor="dealer-expected-requirements">
                Estimated Business Requirements or Order Volume (optional)
              </label>
              <textarea
                id="dealer-expected-requirements"
                name="expectedRequirements"
                rows={3}
                placeholder="Share an estimate only if you already have one."
              />
            </div>
          </>
        ) : (
          <div className="field wide">
            <label htmlFor="contact-product">Product Interest</label>
            <select
              id="contact-product"
              name="product"
              value={selectedProduct}
              onChange={(event) => setSelectedProduct(event.target.value)}
            >
              <option value="">— Select a model (optional) —</option>
              {categories.map((category) => (
                <optgroup key={category.slug} label={category.name}>
                  {products
                    .filter((product) => product.categorySlug === category.slug)
                    .map((product) => (
                      <option key={product.slug} value={product.slug}>
                        {product.model}
                      </option>
                    ))}
                </optgroup>
              ))}
              <option value="general">General Enquiry</option>
            </select>
          </div>
        )}
        <div className="field wide">
          <label htmlFor={`${fieldPrefix}-message`}>Additional Message *</label>
          <textarea
            id={`${fieldPrefix}-message`}
            name="message"
            required
            rows={4}
            placeholder={
              selectedModel
                ? `I'm interested in the ${selectedModel.model}. Please provide more details.`
                : "Share a little about your enquiry."
            }
          />
        </div>
      </div>
      <p className="form-delivery-note">
        {dealer
          ? "Dealer enquiries are prepared as an email draft on your device. This website has no dealer-lead submission backend."
          : "Enquiry delivery uses your device’s email application. No backend submission service is configured on this website."}
      </p>
      <button className="btn" type="submit" data-testid="button-submit-enquiry">
        Prepare Email Enquiry{" "}
        <ArrowRight size={15} />
      </button>
    </form>
  );
}

function Contact({ dealer = false }: { dealer?: boolean }) {
  useEffect(() => {
    if (window.location.hash !== "#enquiry-form") return;
    window.requestAnimationFrame(() =>
      document.getElementById("enquiry-form")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      }),
    );
  }, []);
  const categoryParam =
    new URLSearchParams(window.location.search).get("category") ?? "";
  const productParam =
    new URLSearchParams(window.location.search).get("product") ?? "";
  const initialProduct =
    products.find((product) => product.slug === productParam)?.slug ??
    products.find((product) => product.categorySlug === categoryParam)?.slug ??
    "";
  return (
    <>
      <Meta
        title={dealer ? "Dealer enquiry" : "Contact MAXBE INDUSTRIES"}
        description="Contact MAXBE Industries in Coimbatore about pump products, quotations and factory directions."
      />
      <PageHero
        kicker={dealer ? "DEALER NETWORK" : "GET IN TOUCH"}
        className={dealer ? "" : "contact-page-hero"}
        kickerClassName={dealer ? "" : "contact-page-kicker"}
        title={dealer ? "Become a MAXBE Dealer" : "Contact Us"}
        text={
          dealer
            ? "Share your business details and product interests with MAXBE."
            : "Have questions about our motors or pumps? Request product information, discuss your requirements, or get in touch with our team."
        }
      />
      {!dealer && <ContactFactoryLocation />}
      <section className="section contact-enquiry-section" id="enquiry-form">
        <div className="container contact-layout">
          <div className="contact-intro">
            {dealer && <Eyebrow>DEALER ENQUIRY</Eyebrow>}
            <h2>
              {dealer ? "Tell us about your business." : "Send an Enquiry"}
            </h2>
            <p>
              {dealer
                ? "Interested in becoming a Maxbe Pumps dealer? Share your business details, location, and product interests so our team can understand your requirements and discuss potential dealership opportunities."
                : "We usually respond during business hours. Select a product model if you would like to include it in your message."}
            </p>
            <div className="notice contact-enquiry-notice">
              <Info size={18} aria-hidden="true" />
              <span>
                This form prepares an email draft using your device’s email
                application. The website does not send or store enquiries.
              </span>
            </div>
            {dealer && (
              <a
                className="dealer-contact-whatsapp"
                href={createWhatsAppUrl(
                  "Hello MAXBE PUMPS, I would like to discuss a potential dealership opportunity.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={18} />
                Enquire About Dealership on WhatsApp
              </a>
            )}
            <SocialLinks className="contact-social-links" />
          </div>
          <ContactForm dealer={dealer} initialProduct={initialProduct} />
        </div>
      </section>
    </>
  );
}

function Resources() {
  return (
    <>
      <Meta
        title="Support & resources"
        description="Official MAXBE support documents have not been supplied. Find honest guidance and next steps."
      />
      <PageHero
        kicker="SUPPORT & RESOURCES"
        title="Useful guidance, without imaginary downloads."
        text="No official manuals, product sheets, warranty documents or technical downloads have been supplied. This page keeps that status clear."
      />
      <section className="section">
        <div className="container">
          <div className="notice">
            There are currently no official MAXBE documents available on this
            website. We will not present placeholder files as downloads.
          </div>
          <div style={{ marginTop: 48 }} className="section-head">
            <div>
              <Eyebrow>BEFORE PRODUCT SELECTION</Eyebrow>
              <h2>
                Details worth gathering before you speak with a professional.
              </h2>
            </div>
            <p>
              These prompts are general planning guidance, not MAXBE product
              specifications or engineering recommendations.
            </p>
          </div>
          <div className="tile-grid">
            {[
              [
                "01",
                "Source",
                "Where the water is: borewell, open well, tank, sump, surface or another source.",
              ],
              [
                "02",
                "Destination",
                "Where it must go and approximate vertical lift or route, if known.",
              ],
              [
                "03",
                "Use",
                "Approximate volume and pattern of use. “Not sure” is fine.",
              ],
              [
                "04",
                "Power",
                "What supply exists at the installation site, if known.",
              ],
              [
                "05",
                "Site",
                "Indoor, outdoor or well-side conditions and constraints.",
              ],
              [
                "06",
                "Verification",
                "Ask a qualified professional to check the complete installation.",
              ],
            ].map(([n, t, d]) => (
              <div className="tile" key={n}>
                <span className="tile-num">{n} / PREP</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 50 }}>
            <Link className="btn" href="/find-your-pump">
              Open the preliminary finder <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <CTA
        title="Need a product document?"
        text="Official product resources are not available yet. You can outline your question in our non-submitting demo form."
        href="/contact"
        label="Open demo enquiry"
      />
    </>
  );
}

function About() {
  return (
    <>
      <Meta
        title="About MAXBE"
        description="Learn about MAXBE Industries, its Coimbatore beginnings and pump product ranges."
      />
      <PageHero
        kicker="OUR STORY"
        title="About MAXBE PUMPS"
        text="Learn about MAXBE Industries, its Coimbatore roots, and the pump categories listed on this website."
      />
      <section className="section about-story-section">
        <div className="container split">
          <div className="story-copy about-story-copy">
            <Eyebrow>WHO WE ARE</Eyebrow>
            <h2>MAXBE INDUSTRIES — Coimbatore, since 1992</h2>
            <p>
              Established in 1992 in Coimbatore, MAXBE Industries manufactures
              and supplies the MAXBE PUMPS brand.
            </p>
            <p>
              The company’s product range includes monoblock pumps, open well
              submersible pumps and slim 4-inch V4 submersible pumps.
            </p>
            <p>
              The MAXBE website describes its pumps as designed for low-voltage
              conditions common in rural and semi-urban areas.
            </p>
            <Link className="text-link" href="/products">
              Browse Our Products <ArrowRight size={15} />
            </Link>
          </div>
          <div className="story-panel about-brand-panel">
            <img
              className="about-brand-logo"
              src="/assets/maxbe-logo-transparent.png"
              alt="MAXBE Pumps"
            />
            <p>LOW VOLTAGE KING</p>
            <span>MAXBE Industries · Coimbatore · Est. 1992</span>
          </div>
        </div>
      </section>
      <section className="section about-values-section">
        <div className="container split">
          <article className="story-panel">
            <Eyebrow>OUR MISSION</Eyebrow>
            <h3>Pump options for water needs</h3>
            <p>
              The ranges listed on this website include monoblock, open well
              submersible, and V4 submersible pumps for the applications
              described in the published product information.
            </p>
          </article>
          <article className="story-panel">
            <Eyebrow>OUR VISION</Eyebrow>
            <h3>A clear next step</h3>
            <p>
              Review the available ranges and published model details, then
              contact MAXBE to confirm product fit and current availability.
            </p>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="container section-head">
          <div>
            <Eyebrow>CORE VALUES</Eyebrow>
            <h2>What We Stand For</h2>
          </div>
          <p>
            Use the published information as a starting point and confirm
            current product details directly with MAXBE.
          </p>
        </div>
        <div className="container tile-grid">
          {[
            [
              "Clear product categories",
              "Browse the three pump ranges listed on this website.",
            ],
            [
              "Application context",
              "Review water-source and delivery prompts before comparing options.",
            ],
            [
              "Direct enquiries",
              "Use the available phone, email and WhatsApp contact links.",
            ],
            [
              "Honest availability",
              "Missing official media, catalogue and dealer details are identified.",
            ],
          ].map(([title, text]) => (
            <article className="tile benefit-tile" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section about-standard-section">
        <div className="container section-head">
          <div>
            <Eyebrow>OUR PROCESS</Eyebrow>
            <h2>How to Explore the Range</h2>
          </div>
          <p>
            A practical path from your water requirement to a product enquiry.
          </p>
        </div>
        <div className="container tile-grid">
          {[
            [
              "Define your need",
              "Note your water source, intended use and delivery requirement.",
            ],
            [
              "Compare ranges",
              "Browse the listed categories and published model information.",
            ],
            [
              "Confirm product fit",
              "Ask MAXBE to verify technical details for your application.",
            ],
            [
              "Check availability",
              "Contact MAXBE directly for current availability and dealer details.",
            ],
          ].map(([title, text]) => (
            <article className="tile" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section about-range-section">
        <div className="container section-head">
          <div>
            <Eyebrow>PRODUCT RANGE</Eyebrow>
            <h2>Explore MAXBE pump categories</h2>
          </div>
          <p>
            Browse the categories and listed models; confirm current
            specifications and availability with MAXBE.
          </p>
        </div>
        <div className="container about-range-grid">
          {categories.map((category) => (
            <Link
              className="about-range-card"
              href={`/products?category=${category.slug}`}
              key={category.slug}
            >
              <span>
                <CategoryIcon categorySlug={category.slug} />
              </span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <b>
                Browse range <ArrowRight size={15} />
              </b>
            </Link>
          ))}
        </div>
      </section>
      <section className="section about-dealer-section">
        <div className="container about-dealer-card">
          <div>
            <Eyebrow>DEALER NETWORK</Eyebrow>
            <h2>Looking for a local MAXBE dealer?</h2>
            <p>
              A verified public dealer directory is not currently available.
              Contact MAXBE to confirm dealer availability in your area.
            </p>
          </div>
          <Link className="btn" href="/find-a-dealer">
            Find a Dealer <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <HomeFactoryLocation />
      <CTA
        title="Ready to find the right pump?"
        text="Contact MAXBE about a product or application."
        href="/contact"
        label="Contact Us"
      />
    </>
  );
}

function NotFound() {
  return (
    <>
      <Meta
        title="Page not found"
        description="The requested MAXBE Pumps page could not be found."
      />
      <div className="notfound">
        <div>
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            PAGE NOT FOUND
          </div>
          <h1>404</h1>
          <p>This route has no water in it. Let’s get you back on track.</p>
          <Link className="btn" href="/">
            Back to home <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </>
  );
}

function DealerFinder() {
  const [locationQuery, setLocationQuery] = useState("");
  const [searchedLocation, setSearchedLocation] = useState("");

  return (
    <>
      <Meta
        title="Find a MAXBE Dealer"
        description="Contact MAXBE directly to confirm dealer availability in your area."
      />
      <PageHero
        kicker="DEALER NETWORK"
        title="Find a MAXBE Dealer"
        text="Contact the MAXBE team to confirm current dealer availability for your area."
      />
      <section className="section dealer-finder-section">
        <div className="container dealer-finder-card">
          <div>
            <Eyebrow>DEALER INFORMATION</Eyebrow>
            <h2>Search for a dealer near you</h2>
            <form
              className="dealer-lookup-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSearchedLocation(locationQuery.trim());
              }}
            >
              <label htmlFor="dealer-location-search">
                City, area or PIN code
              </label>
              <div className="dealer-lookup-controls">
                <input
                  id="dealer-location-search"
                  name="location"
                  autoComplete="postal-code"
                  placeholder="Enter a city, area or PIN code"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  required
                />
                <button className="btn" type="submit">
                  <Search size={16} aria-hidden="true" />
                  Search
                </button>
              </div>
            </form>
            {searchedLocation && (
              <p className="dealer-search-result" role="status">
                No verified dealer listings are available for{" "}
                <strong>{searchedLocation}</strong> in the website directory.
                Contact MAXBE to check current local availability.
              </p>
            )}
            <p>
              A verified public dealer directory is not currently available on
              this website, so this search does not return unverified names or
              locations. The contact details alongside this search are for
              MAXBE Industries.
            </p>
          </div>
          <div className="dealer-finder-contact">
            <a href="tel:+919488353564">
              <PhoneCall size={18} aria-hidden="true" />
              94883 53564
            </a>
            <a href={`mailto:${factoryLocation.email}`}>
              <MessageCircle size={18} aria-hidden="true" />
              {factoryLocation.email}
            </a>
            <address>
              {factoryLocation.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <a
              href={factoryMapPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation size={18} aria-hidden="true" />
              View MAXBE Industries location
            </a>
            <Link className="btn outline" href="/dealers#enquiry-form">
              Become a Dealer <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function App() {
  return (
    <>
      <Shell>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:slug" component={ProductDetail} />
          <Route path="/catalogue" component={Catalogue} />
          <Route
            path="/catalogue-dashboard"
            component={ProductCatalogueDashboard}
          />
          <Route path="/applications/agriculture">
            <Application kind="agriculture" />
          </Route>
          <Route path="/applications/domestic">
            <Application kind="domestic" />
          </Route>
          <Route path="/find-your-pump" component={Finder} />
          <Route path="/find-a-dealer" component={DealerFinder} />
          <Route path="/support/resources" component={Resources} />
          <Route path="/dealers">
            <Contact dealer />
          </Route>
          <Route path="/about" component={About} />
          <Route path="/contact">
            <Contact />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Shell>
    </>
  );
}

export default App;
