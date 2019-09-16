use std::fs;
use std::collections::HashMap;

fn count_symbols(filename: String) -> HashMap<char, i32> {
    let contents = fs::read_to_string(filename)
        .expect("Cannot read file, check if it exists.");
    let mut char_count = HashMap::new();
    for c in contents.chars()
    {
        *char_count.entry(c).or_insert(0) += 1;
    }
    return char_count;
}

fn main() {
    let filename = std::env::args().nth(1)
        .expect("No path to file was given!");
    let res = count_symbols(filename);
    for (c, i) in res
    {
        println!("{}: {}", c, i);
    }
}
