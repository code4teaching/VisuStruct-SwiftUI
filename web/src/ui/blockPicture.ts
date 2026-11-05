import type { LiveLabels } from '../core/codeGenerator'
import { parseLiveJava } from '../core/javaParser'
import { documentFromJava } from '../core/liveSource'
import { BlockView, type BlockViewOptions } from './blockView'
import { t } from './i18n'

/** Beschriftungen der Block-Ansicht (übersetzt), für den Editor und für Bilder in Lektionen. */
export function blockViewLabels(): BlockViewOptions['labels'] {
  return {
    start: t('web_visubot_blocks_start'),
    else: 'else',
    empty: t('web_visubot_blocks_empty'),
    hint: t('web_visubot_blocks_hint'),
    trash: t('web_visubot_blocks_trash'),
    count: t('web_visubot_blocks_count'),
    countFrom: t('web_visubot_blocks_count_from'),
    countBelow: t('web_visubot_blocks_count_below'),
    countTo: t('web_visubot_blocks_count_to'),
    countAbove: t('web_visubot_blocks_count_above'),
    countStep: t('web_visubot_blocks_count_step'),
    repeat: t('web_visubot_blocks_repeat'),
    repeatTimes: t('web_visubot_blocks_repeat_times'),
    randomFrom: t('web_visubot_blocks_random_from'),
    randomTo: t('web_visubot_blocks_random_to'),
  }
}

const labels: LiveLabels = { condition: 'Bedingung', selector: 'Wert', code: 'Dein Code', start: 'Startwert', step: 'Schritt', end: 'Ende' }

/**
 * Java-Schnipsel einer Lektion (z. B. eine Runde von „Wo landet der mBot2?“) als Blöcke wie im Editor, nur zum Ansehen.
 * Für die Block-Lektionen (Holger 5.11.): Jüngere sehen dort Blöcke statt Java. `undefined`, wenn der Code nicht passt.
 */
export function blockPicture(java: string): HTMLElement | undefined {
  const parsed = parseLiveJava(java, labels)
  if (parsed.problems.length > 0 || parsed.elements.length === 0) return undefined
  const doc = documentFromJava({ caption: '', elements: [] }, parsed)
  const view = new BlockView({ press: () => {}, editValue: () => {}, labels: { ...blockViewLabels(), hint: '' } })
  view.render(doc, undefined, true)
  view.element.hidden = false
  view.element.classList.add('bk-picture')
  return view.element
}
