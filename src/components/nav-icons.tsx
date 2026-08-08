import {
  Home,
  Compass,
  MessageSquareText,
  Palette,
  Download,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * Placeholder icon set (lucide-react) keyed by nav href for leaf items,
 * or by group label for group headers without their own route.
 * Swap the icon per key here when custom Instalsat icons are ready —
 * no other file needs to change.
 */
export const NAV_ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "Núcleo da Marca": Compass,
  "Universo Verbal": MessageSquareText,
  "Universo Visual": Palette,
  "/downloads": Download,
  "/assistente": Sparkles,
};
