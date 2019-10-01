defmodule Lab2 do
  def main(args \\ []) do
    IO.puts("Hello stranger!")
    filename = IO.gets("Enter file name: ")
               |> String.replace("\n", "")

    {res, contents} = File.read(filename)
    if res == :error do
        IO.puts("Error occured:\\")
        true
    end

    contents = String.replace(contents, "\n", "")

    probs = contents
              |> String.graphemes()
              |> Enum.uniq()
              |> Enum.map(fn x -> {x, (length(String.split(contents, x)) - 1) / String.length(contents)} end)
    
    shennon_res = shennon_fano("", probs, [])
    IO.inspect(shennon_res)
    IO.inspect(huffman(probs))

  end

  def shennon_fano(key, data, acc) do
    if length(data) == 1 do
      [{char, prob} | _] = data
      [{key, char, prob} | acc]
    else
      {left, right} = shennon_fano_separation(data, [], [])
      shennon_fano("#{key}0", left, shennon_fano("#{key}1", right, acc))
    end
  end

  def shennon_fano_separation(data, left, right) do
    if length(data) == 0 do
      {left, right}
    else
      [element | rest] = data

      sum_left = left
                  |> Enum.map(fn {x, y} -> y end)
                  |> Enum.sum
      sum_right = right
                  |> Enum.map(fn {x, y} -> y end)
                  |> Enum.sum
      if sum_left < sum_right do
        shennon_fano_separation(rest, [element | left], right)
      else
        shennon_fano_separation(rest, left, [element | right])
      end
    end
  end

  def huffman(data) do
    if length(data) == 2 do
      [{char1, prob1}, {char2, prob2}] = data
      [{"0", char1, prob1}, {"1", char2, prob2}]
    else
      [min1, min2] = data
                     |> Enum.sort_by(fn {char, prob} -> prob end)
                     |> Enum.take(2)

      {min1_char, min1_prob} = min1
      {min2_char, min2_prob} = min2

      huffman([{"#{min1_char}#{min2_char}", min1_prob + min2_prob} | Enum.filter(data, fn {char, prob} -> char != min1_char && char != min2_char end)])
    end
  end
end
