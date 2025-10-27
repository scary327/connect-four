use wasm_bindgen::prelude::*;
use rand::Rng;

const EMPTY: u8 = 0;
const PLAYER: u8 = 1;
const BOT: u8 = 2;

#[wasm_bindgen]
pub fn compute_move(
    moves: Vec<u8>,
    difficulty: String,
    rows: u8,
    columns: u8,
    win_condition: u8,
) -> u8 {
    let size = (rows as usize) * (columns as usize);
    let mut board = vec![EMPTY; size];
    
    for (i, &col) in moves.iter().enumerate() {
        let player_id = if i % 2 == 0 { PLAYER } else { BOT };
        drop_piece(&mut board, col, player_id, columns, rows);
    }

    if check_winner(&board, win_condition, rows, columns).is_some() || get_valid_moves(&board, columns).is_empty() {
        return get_valid_moves(&board, columns).first().copied().unwrap_or(0);
    }

    let is_bot_turn = moves.len() % 2 == 1;
    
    if !is_bot_turn {
        return get_valid_moves(&board, columns).first().copied().unwrap_or(0);
    }

    match difficulty.as_str() {
        "easy" => easy_bot(&board, columns),
        "medium" => medium_bot(&board, rows, columns, win_condition),
        "insane" => insane_bot(&board, rows, columns, win_condition),
        _ => easy_bot(&board, columns),
    }
}

fn drop_piece(board: &mut Vec<u8>, col: u8, player: u8, columns: u8, rows: u8) {
    let cols = columns as usize;
    let rows_usize = rows as usize;
    for row in (0..rows_usize).rev() {
        let idx = row * cols + col as usize;
        if board[idx] == EMPTY {
            board[idx] = player;
            break;
        }
    }
}

fn get_valid_moves(board: &Vec<u8>, columns: u8) -> Vec<u8> {
    let cols = columns as usize;
    (0..cols)
        .filter(|&col| board[col] == EMPTY)
        .map(|col| col as u8)
        .collect()
}

fn check_winner(board: &Vec<u8>, win_condition: u8, rows: u8, columns: u8) -> Option<u8> {
    let rows_usize = rows as usize;
    let cols_usize = columns as usize;
    let win = win_condition as usize;

    for r in 0..rows_usize {
        for c in 0..(cols_usize - win + 1) {
            let idx = r * cols_usize + c;
            let cell = board[idx];
            if cell != EMPTY && (0..win).all(|i| board[idx + i] == cell) {
                return Some(cell);
            }
        }
    }

    for c in 0..cols_usize {
        for r in 0..(rows_usize - win + 1) {
            let base_idx = r * cols_usize + c;
            let cell = board[base_idx];
            if cell != EMPTY && (0..win).all(|i| board[base_idx + i * cols_usize] == cell) {
                return Some(cell);
            }
        }
    }

    for r in 0..(rows_usize - win + 1) {
        for c in 0..(cols_usize - win + 1) {
            let base_idx = r * cols_usize + c;
            let cell = board[base_idx];
            if cell != EMPTY && (0..win).all(|i| board[base_idx + i * (cols_usize + 1)] == cell) {
                return Some(cell);
            }
        }
    }

    for r in 0..(rows_usize - win + 1) {
        for c in (win - 1)..cols_usize {
            let base_idx = r * cols_usize + c;
            let cell = board[base_idx];
            if cell != EMPTY && (0..win).all(|i| board[base_idx + i * (cols_usize - 1)] == cell) {
                return Some(cell);
            }
        }
    }

    None
}

fn easy_bot(board: &Vec<u8>, columns: u8) -> u8 {
    let mut valid = get_valid_moves(board, columns);
    if valid.is_empty() {
        return 0;
    }
    
    let center = (columns / 2) as usize;
    if valid.contains(&(center as u8)) {
        return center as u8;
    }
    
    let mut rng = rand::thread_rng();
    let idx = rng.gen_range(0..valid.len());
    valid.swap_remove(idx);
    *valid.first().unwrap_or(&0)
}

fn medium_bot(board: &Vec<u8>, rows: u8, columns: u8, win_condition: u8) -> u8 {
    let mut valid = get_valid_moves(board, columns);
    if valid.is_empty() {
        return 0;
    }
    
    valid.sort_by_key(|&col| i32::abs((columns / 2u8) as i32 - col as i32)); 

    let mut best_score = i32::MIN;
    let mut best_move = valid[0];

    for &col in &valid {
        let mut new_board = board.clone();
        drop_piece(&mut new_board, col, BOT, columns, rows);
        let score = minimax(&new_board, 4, false, rows, columns, win_condition);
        if score > best_score {
            best_score = score;
            best_move = col;
        }
    }
    best_move
}

fn insane_bot(board: &Vec<u8>, rows: u8, columns: u8, win_condition: u8) -> u8 {
    let mut valid = get_valid_moves(board, columns);
    if valid.is_empty() {
        return 0;
    }
    
    valid.sort_by_key(|&col| i32::abs((columns / 2u8) as i32 - col as i32)); 

    let mut best_score = i32::MIN;
    let mut best_move = valid[0];

    for &col in &valid {
        let mut new_board = board.clone();
        drop_piece(&mut new_board, col, BOT, columns, rows);
        let score = alphabeta(&new_board, 8, i32::MIN, i32::MAX, false, rows, columns, win_condition);
        if score > best_score {
            best_score = score;
            best_move = col;
        }
    }
    best_move
}

fn minimax(
    board: &Vec<u8>,
    depth: u8,
    is_maximizing: bool,
    rows: u8,
    columns: u8,
    win_condition: u8,
) -> i32 {
    if let Some(winner) = check_winner(board, win_condition, rows, columns) {
        return if winner == BOT { 1000 - depth as i32 } else { -1000 + depth as i32 };
    }
    if depth == 0 || get_valid_moves(board, columns).is_empty() {
        return evaluate_board(board, columns);
    }

    let valid = get_valid_moves(board, columns);
    if is_maximizing {
        let mut max_eval = i32::MIN;
        for col in valid {
            let mut new_board = board.clone();
            drop_piece(&mut new_board, col, BOT, columns, rows);
            let eval = minimax(&new_board, depth - 1, false, rows, columns, win_condition);
            max_eval = max_eval.max(eval);
        }
        max_eval
    } else {
        let mut min_eval = i32::MAX;
        for col in valid {
            let mut new_board = board.clone();
            drop_piece(&mut new_board, col, PLAYER, columns, rows);
            let eval = minimax(&new_board, depth - 1, true, rows, columns, win_condition);
            min_eval = min_eval.min(eval);
        }
        min_eval
    }
}

fn alphabeta(
    board: &Vec<u8>,
    depth: u8,
    mut alpha: i32,
    mut beta: i32,
    is_maximizing: bool,
    rows: u8,
    columns: u8,
    win_condition: u8,
) -> i32 {
    if let Some(winner) = check_winner(board, win_condition, rows, columns) {
        return if winner == BOT { 10000 - depth as i32 } else { -10000 + depth as i32 };
    }
    if depth == 0 || get_valid_moves(board, columns).is_empty() {
        return evaluate_board(board, columns);
    }

    let valid = get_valid_moves(board, columns);
    if is_maximizing {
        let mut max_eval = i32::MIN;
        for col in valid {
            let mut new_board = board.clone();
            drop_piece(&mut new_board, col, BOT, columns, rows);
            let eval = alphabeta(&new_board, depth - 1, alpha, beta, false, rows, columns, win_condition);
            max_eval = max_eval.max(eval);
            alpha = alpha.max(eval);
            if beta <= alpha {
                break;
            }
        }
        max_eval
    } else {
        let mut min_eval = i32::MAX;
        for col in valid {
            let mut new_board = board.clone();
            drop_piece(&mut new_board, col, PLAYER, columns, rows);
            let eval = alphabeta(&new_board, depth - 1, alpha, beta, true, rows, columns, win_condition);
            min_eval = min_eval.min(eval);
            beta = beta.min(eval);
            if beta <= alpha {
                break;
            }
        }
        min_eval
    }
}

fn evaluate_board(board: &Vec<u8>, columns: u8) -> i32 {
    let mut score = 0;
    let cols = columns as usize;
    let rows = board.len() / cols;
    let center_col = (cols / 2) as usize;

    for r in 0..rows {
        let mut bot_count = 0;
        let mut player_count = 0;
        for c in 0..cols {
            let idx = r * cols + c;
            if board[idx] == BOT {
                bot_count += 1;
                player_count = 0;
                if bot_count >= 2 {
                    score += if bot_count == 2 { 1 } else { 10 };
                }
            } else if board[idx] == PLAYER {
                player_count += 1;
                bot_count = 0;
                if player_count >= 2 {
                    score -= if player_count == 2 { 1 } else { 10 };
                }
            } else {
                bot_count = 0;
                player_count = 0;
            }
        }

        let center_idx = r * cols + center_col;
        if board[center_idx] == BOT {
            score += 5;
        } else if board[center_idx] == PLAYER {
            score -= 3;
        }
    }

    let valid_moves = get_valid_moves(board, columns).len() as i32;
    score + valid_moves * 2
}
