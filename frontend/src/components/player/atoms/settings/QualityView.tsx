import { t } from "i18next";
import { useCallback } from "react";

import { Toggle } from "@/components/buttons/Toggle";
import { Menu } from "@/components/player/internals/ContextMenu";
import { SelectableLink } from "@/components/player/internals/ContextMenu/Links";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import {
  SourceQuality,
  allQualities,
  qualityToString,
} from "@/stores/player/utils/qualities";
import { useQualityStore } from "@/stores/quality";

const alwaysVisibleQualities: Record<SourceQuality, boolean> = {
  unknown: false,
  "360": true,
  "480": true,
  "720": true,
  "1080": true,
  "4k": true,
};

export function QualityView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const sourceType = usePlayerStore((s) => s.source?.type);
  const availableQualities = usePlayerStore((s) => s.qualities);
  const currentQuality = usePlayerStore((s) => s.currentQuality);
  const switchQuality = usePlayerStore((s) => s.switchQuality);
  const enableAutomaticQuality = usePlayerStore(
    (s) => s.enableAutomaticQuality,
  );
  const setAutomaticQuality = useQualityStore((s) => s.setAutomaticQuality);
  const setLastChosenQuality = useQualityStore((s) => s.setLastChosenQuality);
  const autoQuality = useQualityStore((s) => s.quality.automaticQuality);

  // Auto quality only makes sense for HLS sources
  const supportsAutoQuality = sourceType === "hls";

  const change = useCallback(
    (q: SourceQuality) => {
      setLastChosenQuality(q);
      // Don't disable auto quality when manually selecting a quality
      // Keep auto quality enabled by default unless user explicitly toggles it
      switchQuality(q);
      router.close();
    },
    [router, switchQuality, setLastChosenQuality],
  );

  const changeAutomatic = useCallback(() => {
    const newValue = !autoQuality;
    setAutomaticQuality(newValue);
    if (newValue) enableAutomaticQuality();
  }, [setAutomaticQuality, autoQuality, enableAutomaticQuality]);

  const visibleQualities = allQualities.filter((quality) => {
    if (alwaysVisibleQualities[quality]) return true;
    if (availableQualities.includes(quality)) return true;
    return false;
  });

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/")}>
        {t("player.menus.quality.title")}
      </Menu.BackLink>
      <Menu.Section className="flex flex-col pb-4">
        {visibleQualities.map((v) => (
          <SelectableLink
            key={v}
            selected={v === currentQuality}
            onClick={
              availableQualities.includes(v) ? () => change(v) : undefined
            }
            disabled={!availableQualities.includes(v)}
          >
            {qualityToString(v)}
          </SelectableLink>
        ))}
        {supportsAutoQuality && (
          <>
            <Menu.Divider />
            <Menu.Link
              rightSide={
                <Toggle onClick={changeAutomatic} enabled={autoQuality} />
              }
            >
              {t("player.menus.quality.automaticLabel")}
            </Menu.Link>
          </>
        )}
      </Menu.Section>
    </>
  );
}
