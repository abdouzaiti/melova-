import { useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  Clock,
  Flame,
  Minus,
  Moon,
  Pause,
  Play,
  Plus,
  Search,
  ShoppingBag,
  Sun,
  Trash2,
  X,
} from "lucide-react"
import DishOrbitCarousel from "./components/DishOrbitCarousel"
import { MelovaLogo, RibbonBanner } from "./components/MelovaLogo"
import {
  DISHES,
  MELOVA_BACKDROP,
  PIZZA_SIZE_LABELS,
  SUPPLEMENTS,
  type KitchenDish,
  type PizzaSize,
} from "./data/dishes"

type OrderLine = {
  key: string
  dish: KitchenDish
  size: PizzaSize
  quantity: number
  supplements: string[]
  note: string
}

type SubmittedTicket = {
  id: string
  table: string
  items: {
    title: string
    sizeLabel: string
    supplements: string[]
    quantity: number
    unitTotal: number
  }[]
  total: number
  etaMinutes: number
}

const SIZE_LIST: PizzaSize[] = ["normal", "geante", "mega"]

function calcLineUnitPrice(line: OrderLine): number {
  const base = line.dish.prices[line.size]
  const suppTotal = line.supplements.reduce((acc, sid) => {
    const found = SUPPLEMENTS.find((s) => s.id === sid)
    return acc + (found ? found.price : 0)
  }, 0)
  return base + suppTotal
}

export function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [jumpTo, setJumpTo] = useState<{ index: number; seq: number } | null>(null)
  const [darkMode, setDarkMode] = useState(true)

  // Modal / drawer states
  const [videoDish, setVideoDish] = useState<KitchenDish | null>(null)
  const [videoStep, setVideoStep] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(true)
  const [videoSize, setVideoSize] = useState<PizzaSize>("normal")

  const [orderOpen, setOrderOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [tableLabel, setTableLabel] = useState("Table 04")
  const [orderLines, setOrderLines] = useState<Record<string, OrderLine>>({})
  const [ticket, setTicket] = useState<SubmittedTicket | null>(null)

  const chalkboardRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (videoDish) setVideoDish(null)
      else if (searchOpen) setSearchOpen(false)
      else if (orderOpen) setOrderOpen(false)
      else if (menuOpen) setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [videoDish, searchOpen, orderOpen, menuOpen])

  useEffect(() => {
    if (!videoDish || !videoPlaying) return
    const timer = window.setInterval(() => {
      setVideoStep((prev) => (prev + 1) % videoDish.steps.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [videoDish, videoPlaying])

  const triggerJump = (index: number) => {
    setJumpTo((prev) => ({ index, seq: (prev?.seq ?? 0) + 1 }))
    setActiveIndex(index)
  }

  const addDishToOrder = (dish: KitchenDish, size: PizzaSize = "normal") => {
    setTicket(null)
    const key = `${dish.id}__${size}`
    setOrderLines((prev) => {
      const existing = prev[key]
      return {
        ...prev,
        [key]: {
          key,
          dish,
          size,
          quantity: (existing?.quantity ?? 0) + 1,
          supplements: existing?.supplements ?? [],
          note: existing?.note ?? "",
        },
      }
    })
  }

  const updateQuantity = (key: string, delta: number) => {
    setOrderLines((prev) => {
      const line = prev[key]
      if (!line) return prev
      const nextQty = line.quantity + delta
      if (nextQty <= 0) {
        const copy = { ...prev }
        delete copy[key]
        return copy
      }
      return { ...prev, [key]: { ...line, quantity: nextQty } }
    })
  }

  const updateSize = (oldKey: string, newSize: PizzaSize) => {
    setOrderLines((prev) => {
      const line = prev[oldKey]
      if (!line || line.size === newSize) return prev
      const newKey = `${line.dish.id}__${newSize}`
      const copy = { ...prev }
      delete copy[oldKey]
      const existingTarget = copy[newKey]
      if (existingTarget) {
        copy[newKey] = {
          ...existingTarget,
          quantity: existingTarget.quantity + line.quantity,
          supplements: Array.from(new Set([...existingTarget.supplements, ...line.supplements])),
          note: existingTarget.note || line.note,
        }
      } else {
        copy[newKey] = {
          ...line,
          key: newKey,
          size: newSize,
        }
      }
      return copy
    })
  }

  const toggleSupplement = (key: string, suppId: string) => {
    setOrderLines((prev) => {
      const line = prev[key]
      if (!line) return prev
      const exists = line.supplements.includes(suppId)
      const nextSupps = exists
        ? line.supplements.filter((id) => id !== suppId)
        : [...line.supplements, suppId]
      return { ...prev, [key]: { ...line, supplements: nextSupps } }
    })
  }

  const updateNote = (key: string, note: string) => {
    setOrderLines((prev) => {
      const line = prev[key]
      if (!line) return prev
      return { ...prev, [key]: { ...line, note } }
    })
  }

  const lineList = Object.values(orderLines)
  const itemCount = lineList.reduce((sum, l) => sum + l.quantity, 0)
  const subtotal = lineList.reduce((sum, l) => sum + calcLineUnitPrice(l) * l.quantity, 0)

  const submitOrder = () => {
    if (!lineList.length) return
    const maxPrep = Math.max(...lineList.map((l) => l.dish.prepMinutes))
    const ticketId = "ML-" + String(1040 + Math.floor(Math.random() * 90))
    setTicket({
      id: ticketId,
      table: tableLabel,
      items: lineList.map((l) => ({
        title: l.dish.subtitle,
        sizeLabel: PIZZA_SIZE_LABELS[l.size],
        supplements: l.supplements.map(
          (sid) => SUPPLEMENTS.find((s) => s.id === sid)?.name ?? sid
        ),
        quantity: l.quantity,
        unitTotal: calcLineUnitPrice(l),
      })),
      total: subtotal,
      etaMinutes: maxPrep,
    })
    setOrderLines({})
  }

  const filteredDishes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return DISHES.map((d, idx) => ({ dish: d, idx }))
    return DISHES.map((d, idx) => ({ dish: d, idx })).filter(({ dish }) => {
      const haystack = [
        dish.title,
        dish.subtitle,
        dish.description,
        dish.course,
        ...(dish.ingredients ?? []),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [searchQuery])

  const currentVideoStep = videoDish ? videoDish.steps[videoStep] ?? videoDish.steps[0] : null

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
      <DishOrbitCarousel
        dishes={DISHES}
        height="100svh"
        backdrop={MELOVA_BACKDROP}
        loop={true}
        brandName="MELOVA"
        brandTagline="Pizzeria · Fresh & Tasty"
        cartCount={itemCount}
        paused={Boolean(videoDish || orderOpen || searchOpen || menuOpen)}
        autoPlayInterval={3000}
        jumpTo={jumpTo}
        onChange={(idx) => setActiveIndex(idx)}
        onPlay={(_dish, idx) => {
          const full = DISHES[idx]
          if (!full) return
          setVideoDish(full)
          setVideoStep(0)
          setVideoSize("normal")
          setVideoPlaying(true)
        }}
        onOrder={(_dish, idx, size) => {
          const full = DISHES[idx]
          if (!full) return
          addDishToOrder(full, size)
          setOrderOpen(true)
        }}
        onOpenCart={() => setOrderOpen(true)}
        onSearch={() => {
          setSearchQuery("")
          setSearchOpen(true)
        }}
        onMenu={() => setMenuOpen(true)}
      />

      {/* Full Melova Chalkboard Menu Section */}
      <section
        ref={chalkboardRef}
        id="melova-carte"
        aria-label="Carte complète Pizzeria MELOVA"
        className="melova-chalkboard relative border-t border-[#F5B700]/25 text-[#F7F6F2] px-4 py-14 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          {/* Chalkboard Header Lockup matching the Melova Poster */}
          <div className="flex flex-col items-center text-center mb-12">
            <MelovaLogo size={86} className="mb-4" />
            <RibbonBanner variant="dark-text" className="mb-3">
              <span className="font-melova-script text-2xl tracking-wide px-4">Menu</span>
            </RibbonBanner>
            <p className="text-xs uppercase tracking-[0.22em] text-[#A8A49C] mt-1">
              Pizzeria Melova · Sélectionnez une taille pour commander directement
            </p>
          </div>

          {/* 2-Column Chalkboard Layout: Pizza List + Center/Right Supplements & Showcase */}
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:items-start">
            {/* Left Column: Pizza Ribbon + All 11 Pizzas */}
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6 pb-3 border-b border-white/10">
                <RibbonBanner>
                  <span className="font-melova-script text-3xl leading-none px-4 drop-shadow-xs">
                    Pizza
                  </span>
                </RibbonBanner>
                <div className="text-right">
                  <span className="font-melova-script text-base text-[#F7F6F2]/90">
                    Normal / Géante / Méga
                  </span>
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {DISHES.map((pizza, idx) => {
                  const isActive = idx === activeIndex
                  return (
                    <div
                      key={pizza.id}
                      className={`py-4 transition-colors ${
                        isActive ? "bg-[#F5B700]/[0.06] -mx-3 px-3 rounded-xl" : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            triggerJump(idx)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }}
                          className="group flex items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-[#F5B700] rounded"
                        >
                          <img
                            src={pizza.image}
                            alt={pizza.subtitle}
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 rounded-full object-cover ring-1 ring-[#F5B700]/40 shrink-0"
                          />
                          <span className="text-lg font-extrabold tracking-wide uppercase text-[#F5B700] group-hover:underline">
                            {pizza.subtitle}
                          </span>
                        </button>

                        <div className="flex items-center gap-1.5 text-sm font-bold tabular-nums text-[#F7F6F2]">
                          {SIZE_LIST.map((sz, sIdx) => (
                            <span key={sz} className="inline-flex items-center">
                              <button
                                type="button"
                                onClick={() => {
                                  addDishToOrder(pizza, sz)
                                  setOrderOpen(true)
                                }}
                                title={`Ajouter ${pizza.subtitle} (${PIZZA_SIZE_LABELS[sz]})`}
                                className="rounded-md px-2 py-1 text-xs sm:text-sm font-bold tabular-nums text-[#F7F6F2] hover:bg-[#F5B700] hover:text-[#141414] transition-colors whitespace-nowrap"
                              >
                                {pizza.prices[sz]}da
                              </button>
                              {sIdx < SIZE_LIST.length - 1 ? (
                                <span className="text-white/35 select-none">/</span>
                              ) : null}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 pl-[52px]">
                        <p className="text-sm text-[#D6D2C9] leading-snug">
                          {pizza.ingredientsText}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            addDishToOrder(pizza, "normal")
                            setOrderOpen(true)
                          }}
                          className="text-xs font-bold text-[#F5B700] hover:underline whitespace-nowrap shrink-0"
                        >
                          + Commander
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Golden-Bordered Suppléments Box */}
            <div className="space-y-8 lg:sticky lg:top-8">

              {/* Golden-bordered Suppléments Box matching the Melova Poster */}
              <div className="rounded-2xl border-2 border-[#F5B700]/80 bg-[#151515] p-6 shadow-xl">
                <div className="text-center mb-5">
                  <h3 className="font-melova-script text-3xl text-[#F5B700]">
                    Suppléments
                  </h3>
                </div>
                <ul className="space-y-3">
                  {SUPPLEMENTS.map((supp) => (
                    <li
                      key={supp.id}
                      className="flex items-center justify-between border-b border-white/10 pb-2.5 last:border-b-0 last:pb-0"
                    >
                      <span className="text-sm font-semibold text-[#F7F6F2]">
                        {supp.name}
                      </span>
                      <span className="text-sm font-extrabold tabular-nums text-[#F5B700]">
                        {supp.price}da
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-[#A8A49C] text-center">
                  Ajoutables sur n’importe quelle pizza dans votre panier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Overlay */}
      {searchOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Rechercher dans le menu Melova"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#F5B700]/30 bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 h-1">
              <span className="bg-[#009246]" />
              <span className="bg-white" />
              <span className="bg-[#ce2b37]" />
            </div>
            <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 px-4 py-3.5">
              <Search className="h-4 w-4 shrink-0 text-[#F5B700]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une pizza, ingrédient (thon, gruyère, crevettes...)"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-muted-foreground)]"
              />
              <button
                type="button"
                aria-label="Fermer la recherche"
                onClick={() => setSearchOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredDishes.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-[var(--color-muted-foreground)]">
                  Aucune pizza trouvée pour « {searchQuery} ».
                </p>
              ) : (
                filteredDishes.map(({ dish, idx }) => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => {
                      triggerJump(idx)
                      setSearchOpen(false)
                    }}
                    className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#F5B700]/12"
                  >
                    <img
                      src={dish.image}
                      alt={dish.subtitle}
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-bold uppercase">
                          {dish.subtitle}
                        </span>
                        <span className="text-xs font-bold tabular-nums text-[#F5B700]">
                          {dish.prices.normal} / {dish.prices.geante} / {dish.prices.mega} da
                        </span>
                      </div>
                      <p className="truncate text-xs text-[var(--color-muted-foreground)]">
                        {dish.ingredientsText}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Full Menu Drawer */}
      {menuOpen ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Carte Pizzeria MELOVA"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col justify-between border-l border-[#F5B700]/25 bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 h-1 shrink-0">
              <span className="bg-[#009246]" />
              <span className="bg-white" />
              <span className="bg-[#ce2b37]" />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between pb-5 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <MelovaLogo size={44} className="shrink-0" />
                  <div>
                    <h2 className="text-base font-extrabold tracking-wider uppercase">
                      Pizzeria MELOVA
                    </h2>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#F5B700]">
                      Normal / Géante / Méga
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Fermer le menu"
                  onClick={() => setMenuOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-1.5">
                {DISHES.map((d, idx) => {
                  const isCurrent = idx === activeIndex
                  return (
                    <div
                      key={d.id}
                      className={`rounded-xl p-2.5 transition-colors ${
                        isCurrent
                          ? "bg-[#F5B700]/12 ring-1 ring-[#F5B700]/45"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          triggerJump(idx)
                          setMenuOpen(false)
                        }}
                        className="flex w-full items-center gap-3 text-left"
                      >
                        <img
                          src={d.image}
                          alt={d.subtitle}
                          referrerPolicy="no-referrer"
                          className="h-11 w-11 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-extrabold uppercase">
                              {d.subtitle}
                            </span>
                            <span className="text-xs font-bold tabular-nums text-[#F5B700]">
                              {d.prices.normal}da · {d.prices.geante}da · {d.prices.mega}da
                            </span>
                          </div>
                          <p className="truncate text-xs text-[var(--color-muted-foreground)]">
                            {d.ingredientsText}
                          </p>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 rounded-xl border border-[#F5B700]/50 p-4">
                <p className="font-melova-script text-xl text-[#F5B700] mb-2">
                  Suppléments
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  {SUPPLEMENTS.map((s) => (
                    <div key={s.id} className="flex justify-between">
                      <span>{s.name}</span>
                      <span className="font-bold tabular-nums text-[#F5B700]">{s.price}da</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-black/10 dark:border-white/10 p-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  chalkboardRef.current?.scrollIntoView({ behavior: "smooth" })
                }}
                className="flex w-full items-center justify-center rounded-xl border border-[#F5B700]/45 px-4 py-2.5 text-sm font-bold text-[#F5B700] transition-colors hover:bg-[#F5B700]/10"
              >
                Voir la carte ardoise complète
              </button>

              <button
                type="button"
                onClick={() => setDarkMode((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-black/15 dark:border-white/15 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                <span className="flex items-center gap-2.5">
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-[#F5B700]" />
                  ) : (
                    <Moon className="h-4 w-4 text-[#D99B00]" />
                  )}
                  {darkMode ? "Mode clair" : "Mode ardoise Melova"}
                </span>
                <span className="text-xs text-[var(--color-muted-foreground)]">
                  {darkMode ? "Ardoise" : "Clair"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  setOrderOpen(true)
                }}
                className="flex w-full items-center justify-between rounded-xl bg-[#F5B700] px-4 py-3 text-sm font-extrabold text-[#141414] shadow-sm transition-opacity hover:opacity-95"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Ouvrir le panier
                </span>
                <span className="tabular-nums">
                  {itemCount} {itemCount <= 1 ? "pizza" : "pizzas"} · {subtotal} da
                </span>
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      {/* Preparation Reel Modal */}
      {videoDish && currentVideoStep ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Préparation de la pizza ${videoDish.subtitle}`}
          onClick={() => setVideoDish(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#F5B700]/30 bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 h-1">
              <span className="bg-[#009246]" />
              <span className="bg-white" />
              <span className="bg-[#ce2b37]" />
            </div>
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#F5B700]">
                  Pizzeria MELOVA · {videoDish.course}
                </p>
                <h2 className="text-lg font-extrabold uppercase tracking-tight">
                  Pizza {videoDish.subtitle}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Fermer l'aperçu"
                onClick={() => setVideoDish(null)}
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr] md:items-center">
              <div
                className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-full p-2"
                style={{ background: `color-mix(in oklab, ${videoDish.accent} 20%, transparent)` }}
              >
                <img
                  src={videoDish.image}
                  alt={videoDish.subtitle}
                  referrerPolicy="no-referrer"
                  className="h-44 w-44 rounded-full object-cover shadow-lg transition-transform duration-700"
                  style={{ transform: `rotate(${videoStep * 18}deg) scale(${videoPlaying ? 1.04 : 1})` }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
                  <span className="font-bold uppercase tracking-wider text-[var(--color-foreground)]">
                    Étape {videoStep + 1} / {videoDish.steps.length} · {currentVideoStep.stage}
                  </span>
                  <span className="tabular-nums font-bold text-[#F5B700]">
                    {currentVideoStep.time}
                    {currentVideoStep.temp ? ` · ${currentVideoStep.temp}` : ""}
                  </span>
                </div>

                <p className="min-h-12 text-sm leading-relaxed">{currentVideoStep.detail}</p>

                <div className="grid grid-cols-4 gap-2">
                  {videoDish.steps.map((st, idx) => (
                    <button
                      key={st.stage}
                      type="button"
                      onClick={() => {
                        setVideoStep(idx)
                        setVideoPlaying(false)
                      }}
                      className={`rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                        idx === videoStep
                          ? "bg-[#F5B700] text-[#141414] font-bold"
                          : "bg-black/5 dark:bg-white/10 text-[var(--color-muted-foreground)] hover:bg-black/10 dark:hover:bg-white/15"
                      }`}
                    >
                      <div className="tabular-nums opacity-80">{st.time}</div>
                      <div className="truncate">{st.stage}</div>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVideoPlaying((p) => !p)}
                      className="inline-flex items-center gap-2 rounded-lg border border-black/15 dark:border-white/20 px-3 py-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {videoPlaying ? <Pause className="h-3.5 w-3.5 text-[#F5B700]" /> : <Play className="h-3.5 w-3.5 text-[#F5B700]" />}
                      {videoPlaying ? "Pause" : "Reprendre"}
                    </button>
                    <div className="inline-flex rounded-lg border border-black/15 dark:border-white/20 p-0.5 text-xs">
                      {SIZE_LIST.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setVideoSize(sz)}
                          className={`rounded-md px-2 py-1 font-bold transition-colors ${
                            videoSize === sz ? "bg-[#F5B700] text-[#141414]" : "text-[var(--color-muted-foreground)]"
                          }`}
                        >
                          {PIZZA_SIZE_LABELS[sz]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addDishToOrder(videoDish, videoSize)
                      setVideoDish(null)
                      setOrderOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#F5B700] px-4 py-2 text-xs font-extrabold text-[#141414] hover:opacity-95 tabular-nums"
                  >
                    Commander · {videoDish.prices[videoSize]} da
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Order Tray Drawer */}
      {orderOpen ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Panier Pizzeria MELOVA"
          onClick={() => setOrderOpen(false)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col justify-between border-l border-[#F5B700]/25 bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 h-1 shrink-0">
              <span className="bg-[#009246]" />
              <span className="bg-white" />
              <span className="bg-[#ce2b37]" />
            </div>

            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <MelovaLogo size={38} className="shrink-0" />
                <div>
                  <h2 className="text-base font-extrabold uppercase tracking-tight">
                    Commande MELOVA
                  </h2>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Ticket cuisine · {tableLabel}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Fermer le panier"
                onClick={() => setOrderOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {ticket ? (
                <div className="rounded-2xl border border-[#F5B700]/45 bg-[#F5B700]/10 p-5 space-y-3">
                  <div className="flex items-center gap-2.5 text-sm font-bold">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#F5B700] text-[#141414]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>Ticket #{ticket.id} Confirmé — Au four</span>
                  </div>
                  <p className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#F5B700]" />
                    <span>Prête dans ~{ticket.etaMinutes} min · {ticket.table}</span>
                  </p>
                  <div className="border-t border-black/10 dark:border-white/10 pt-3 space-y-2 text-xs">
                    {ticket.items.map((it, idx) => (
                      <div key={`${it.title}-${it.sizeLabel}-${idx}`} className="flex justify-between gap-2 tabular-nums">
                        <div>
                          <span className="font-bold">
                            {it.quantity}× {it.title} ({it.sizeLabel})
                          </span>
                          {it.supplements.length > 0 ? (
                            <div className="text-[11px] text-[var(--color-muted-foreground)]">
                              + {it.supplements.join(", ")}
                            </div>
                          ) : null}
                        </div>
                        <span className="font-bold">{it.unitTotal * it.quantity} da</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-black/10 dark:border-white/10 pt-2 font-extrabold tabular-nums">
                      <span>Total</span>
                      <span className="text-[#F5B700]">{ticket.total} da</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {lineList.length === 0 && !ticket ? (
                <div className="py-12 text-center space-y-2">
                  <Flame className="mx-auto h-7 w-7 text-[#F5B700]" />
                  <p className="text-sm font-bold">Votre panier est vide</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Choisissez une pizza et sa taille (Normal, Géante ou Méga) pour commencer.
                  </p>
                </div>
              ) : null}

              {lineList.map((line) => {
                const { key, dish, size, quantity, supplements, note } = line
                const unitPrice = calcLineUnitPrice(line)
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-black/10 dark:border-white/12 p-3.5 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dish.image}
                        alt={dish.subtitle}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-sm font-extrabold uppercase">
                            {dish.subtitle}
                          </span>
                          <span className="text-sm font-extrabold tabular-nums text-[#F5B700]">
                            {unitPrice * quantity} da
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                          Taille {PIZZA_SIZE_LABELS[size]} ({dish.prices[size]} da) · {dish.prepMinutes} min
                        </p>
                      </div>
                    </div>

                    {/* Taille selector */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#F5B700]">
                        Taille
                      </p>
                      <div className="grid grid-cols-3 gap-1.5" role="group" aria-label={`Taille pour ${dish.subtitle}`}>
                        {SIZE_LIST.map((sz) => {
                          const isSelected = size === sz
                          return (
                            <button
                              key={sz}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => updateSize(key, sz)}
                              className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-[11px] font-bold transition-colors ${
                                isSelected
                                  ? "border-[#F5B700] bg-[#F5B700] text-[#141414]"
                                  : "border-black/12 dark:border-white/12 text-[var(--color-muted-foreground)] hover:border-[#F5B700]/50 hover:text-[var(--color-foreground)]"
                              }`}
                            >
                              <span>{PIZZA_SIZE_LABELS[sz]}</span>
                              <span className="tabular-nums text-[10px] opacity-85">
                                {dish.prices[sz]} da
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Suppléments selector */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#F5B700]">
                        Suppléments
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {SUPPLEMENTS.map((supp) => {
                          const checked = supplements.includes(supp.id)
                          return (
                            <button
                              key={supp.id}
                              type="button"
                              aria-pressed={checked}
                              onClick={() => toggleSupplement(key, supp.id)}
                              className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                                checked
                                  ? "border-[#F5B700] bg-[#F5B700]/15 text-[#F5B700]"
                                  : "border-black/12 dark:border-white/12 text-[var(--color-muted-foreground)] hover:border-[#F5B700]/50"
                              }`}
                            >
                              <span className="truncate">{supp.name}</span>
                              <span className="tabular-nums ml-1">+{supp.price}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => updateNote(key, e.target.value)}
                        placeholder="Note (bien cuite, sans maïs...)"
                        className="flex-1 rounded-lg border border-black/15 dark:border-white/15 bg-transparent px-2.5 py-1.5 text-xs outline-none focus:border-[#F5B700]"
                      />
                      <div className="flex items-center gap-1 rounded-lg border border-black/15 dark:border-white/15 px-1 py-0.5">
                        <button
                          type="button"
                          aria-label="Diminuer la quantité"
                          onClick={() => updateQuantity(key, -1)}
                          className="grid h-6 w-6 place-items-center rounded hover:bg-[#ce2b37]/15 hover:text-[#ce2b37]"
                        >
                          {quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                        </button>
                        <span className="w-5 text-center text-xs font-bold tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Augmenter la quantité"
                          onClick={() => updateQuantity(key, 1)}
                          className="grid h-6 w-6 place-items-center rounded hover:bg-[#F5B700]/20 hover:text-[#F5B700]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {lineList.length > 0 ? (
              <div className="border-t border-black/10 dark:border-white/10 p-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="table-select" className="font-medium text-[var(--color-muted-foreground)]">
                    Table / Service
                  </label>
                  <select
                    id="table-select"
                    value={tableLabel}
                    onChange={(e) => setTableLabel(e.target.value)}
                    className="rounded-lg border border-black/15 dark:border-white/15 bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-semibold outline-none"
                  >
                    <option value="Table 01">Table 01</option>
                    <option value="Table 04">Table 04</option>
                    <option value="Table 08">Table 08</option>
                    <option value="Comptoir">Comptoir</option>
                    <option value="À emporter">À emporter</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-sm font-extrabold">
                  <span>Sous-total</span>
                  <span className="tabular-nums text-[#F5B700]">{subtotal} da</span>
                </div>

                <button
                  type="button"
                  onClick={submitOrder}
                  className="w-full rounded-xl bg-[#F5B700] py-3 text-sm font-extrabold text-[#141414] shadow-sm transition-opacity hover:opacity-95 tabular-nums"
                >
                  Confirmer la commande · {subtotal} da
                </button>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </main>
  )
}

export default App
