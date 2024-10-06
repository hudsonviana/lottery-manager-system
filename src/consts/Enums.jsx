export const USER_ROLES = [
  {
    value: 'USER',
    label: 'Usuário',
  },
  {
    value: 'ADMIN',
    label: 'Administrador',
  },
];

export const GAME_RESULT = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'WON_SIX_NUM', label: 'Sena' },
  { value: 'WON_FIVE_NUM', label: 'Quina' },
  { value: 'WON_FOUR_NUM', label: 'Quadra' },
  { value: 'LOST', label: 'Não contemplado' },
];

export const DRAW_STATUS = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'DRAWN', label: 'Sorteio realizado' },
];

/**
 * 
 * enum DrawStatus {
  DRAWN
  PENDING
}
 * 
 * enum GameResult {
  WON_SIX_NUM
  WON_FIVE_NUM
  WON_FOUR_NUM
  LOST
  PENDING
}

enum Role {
  USER
  ADMIN
}

enum Lottery {
  MEGA_SENA
  QUINA
  LOTOFACIL
  TIMEMANIA
  LOTOMANIA
}






 */
