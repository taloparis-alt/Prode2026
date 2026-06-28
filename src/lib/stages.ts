// Etiqueta de la instancia de un partido (grupo o ronda eliminatoria).
// Centralizado para que todas las pantallas muestren lo mismo.
export function stageLabel(stage: string, groupLetter?: string | null): string {
  switch (stage) {
    case 'group': return `Grupo ${groupLetter ?? ''}`.trim()
    case 'r32':   return 'Dieciseisavos'
    case 'r16':   return 'Octavos'
    case 'qf':    return 'Cuartos'
    case 'sf':    return 'Semifinal'
    case 'third': return '3er Puesto'
    case 'final': return 'Final'
    default:      return stage
  }
}
