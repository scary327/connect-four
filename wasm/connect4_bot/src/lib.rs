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
    let mut board = vec![vec![EMPTY; columns as usize]; rows as usize];
    
    for (i, &col) in moves.iter().enumerate() {
        let player_id = if i % 2 == 0 { PLAYER } else { BOT };
        drop_piece(&mut board, col, player_id);
    }

    let is_bot_turn = moves.len() % 2 == 1;
    
    if !is_bot_turn {
        return get_valid_moves(&board).first().copied().unwrap_or(0);
    }

    match difficulty.as_str() {
        "easy" => easy_bot(&board),
        "medium" => medium_bot(&board, rows, columns, win_condition),
        "insane" => insane_bot(&board, rows, columns, win_condition),
        _ => easy_bot(&board),
    }
}


fn drop_piece(board: &mut Vec<Vec<u8>>, col: u8, player: u8) {
    let rows = board.len();
    for row in (0..rows).rev() {
        if board[row][col as usize] == EMPTY {
            board[row][col as usize] = player;
            break;
        }
    }
}

fn get_valid_moves(board: &Vec<Vec<u8>>) -> Vec<u8> {
    let columns = board[0].len();
    (0..columns)
        .filter(|&col| board[0][col] == EMPTY)
        .map(|col| col as u8)
        .collect()
}

fn check_winner(board: &Vec<Vec<u8>>, win_condition: u8) -> Option<u8> {
    let rows = board.len();
    let cols = board[0].len();
    let win = win_condition as usize;

    for r in 0..rows {
        for c in 0..cols {
            let cell = board[r][c];
            if cell == EMPTY { continue; }

            if c + win <= cols && (c..c + win).all(|i| board[r][i] == cell) {
                return Some(cell);
            }
            if r + win <= rows && (r..r + win).all(|i| board[i][c] == cell) {
                return Some(cell);

            if r + win <= rows && c + win <= cols 
                && (0..win).all(|i| board[r + i][c + i] == cell) {
                return Some(cell);
            }

            if r >= win - 1 && c + win <= cols 
                && (0..win).all(|i| board[r - i][c + i] == cell) {
                return Some(cell);
            }
        }
    }
    None
}

fn easy_bot(board: &Vec<Vec<u8>>) -> u8 {
    let valid = get_valid_moves(board);
    let mut rng = rand::thread_rng();
    valid[rng.gen_range(0..valid.len())]
}

fn medium_bot(board: &Vec<Vec<u8>>, rows: u8, columns: u8, win_condition: u8) -> u8 {
    let valid = get_valid_moves(board);
    let mut best_score = i32::MIN;
    let mut best_move = valid[0];

    for &col in &valid {
        let mut new_board = board.clone();
        drop_piece(&mut new_board, col, BOT);
        let score = minimax(&new_board, 3, false, rows, columns, win_condition);
        if score > best_score {
            best_score = score;
            best_move = col;
        }
    }
    best_move
}

fn insane_bot(board: &Vec<Vec<u8>>, rows: u8, columns: u8, win_condition: u8) -> u8 {
    let valid = get_valid_moves(board);
    let mut best_score = i32::MIN;
    let mut best_move = valid[0];

    for &col in &valid {
        let mut new_board = board.clone();
        drop_piece(&mut new_board, col, BOT);
        let score = alphabeta(&new_board, 7, i32::MIN, i32::MAX, false, rows, columns, win_condition);
        if score > best_score {
            best_score = score;
            best_move = col;
        }
    }
    best_move
}

fn minimax(
    board: &Vec<Vec<u8>>,
    depth: u8,
    is_maximizing: bool,
    rows: u8,
    columns: u8,
    win_condition: u8,
) -> i32 {
    if let Some(winner) = check_winner(board, win_condition) {
        return if winner == BOT { 1000 } else { -1000 };
    }
    if depth == 0 || get_valid_moves(board).is_empty() {
        return 0;
    }

    let valid = get_valid_moves(board);
    if is_maximizing {
        let mut max_eval = i32::MIN;
        for col in valid {
            let mut new_board = board.clone();
            drop_piece(&mut new_board, col, BOT);
            let eval = minimax(&new_board, depth - 1, false, rows, columns, win_condition);
            max_eval = max_eval.max(eval);
        }
        max_eval
    } else {
        let mut min_eval = i32::MAX;
        for col in valid {
            let mut new_board = board.clone();
            drop_piece(&mut new_board, col, PLAYER);
            let eval = minimax(&new_board, depth - 1, true, rows, columns, win_condition);
            min_eval = min_eval.min(eval);
        }
        min_eval
    }
}

fn alphabeta(
    board: &Vec<Vec<u8>>,
    depth: u8,
    mut alpha: i32,
    mut beta: i32,
    is_maximizing: bool,
    rows: u8,
    columns: u8,
    win_condition: u8,
) -> i32 {
    if let Some(winner) = check_winner(board, win_condition) {
        return if winner == BOT { 10000 } else { -10000 };
    }
    if depth == 0 || get_valid_moves(board).is_empty() {
        return evaluate_board(board);
    }

    let valid = get_valid_moves(board);
    if is_maximizing {
        let mut max_eval = i32::MIN;
        for col in valid {
            let mut new_board = board.clone();
            drop_piece(&mut new_board, col, BOT);
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
            drop_piece(&mut new_board, col, PLAYER);
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

fn evaluate_board(board: &Vec<Vec<u8>>) -> i32 {
    let mut score = 0;
    score
}
