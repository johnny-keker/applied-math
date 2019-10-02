defmodule Lab2 do
  def main(_args \\ []) do
    IO.puts("Hello stranger!")
    filename = IO.gets("Enter file name: ")
               |> String.replace("\n", "")

    {res, contents} = File.read(filename)
    if res == :error do
        IO.puts("Error occured:\\")
        true
    end

    contents = String.downcase(String.replace(String.replace(contents, "\n", ""), ~r/[[:punct:]]/, "."))

    probs = contents
              |> String.graphemes()
              |> Enum.uniq()
              |> Enum.map(fn x -> {x, (length(String.split(contents, x)) - 1) / String.length(contents)} end)
    
    shennon_res = shennon_fano("", probs, [])
    IO.inspect(shennon_res)
    huffman_res_nodes = probs
                          |> Enum.map(fn {char, prob} -> {[char], prob, None, None, False} end)
                          |> huffman()
    {h_label, _h_prob, _h_ch1, _h_ch2, _h_checked} = Enum.max_by(huffman_res_nodes, fn {_label, prob, _ch1, _ch2, _checked} -> prob end)
    IO.inspect(huffman_code_generation(huffman_res_nodes, "", h_label, []))
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
                  |> Enum.map(fn {_x, y} -> y end)
                  |> Enum.sum
      sum_right = right
                  |> Enum.map(fn {_x, y} -> y end)
                  |> Enum.sum
      if sum_left < sum_right do
        shennon_fano_separation(rest, [element | left], right)
      else
        shennon_fano_separation(rest, left, [element | right])
      end
    end
  end

  def huffman_code_generation(nodes, curr_code, curr_label, acc) do
    [{label, prob, ch1, ch2, _checked}] = Enum.filter(nodes, fn {label, _prob, _ch1, _ch2, _checked} -> label == curr_label end)
    if ch1 == None do
      [char] = label
      [{"#{curr_code}", char, prob} | acc]
    else
      {label1, _prob1, _ch11, _ch12, _checked} = ch1
      {label2, _prob2, _ch21, _ch22, _checked} = ch2
      huffman_code_generation(nodes, "#{curr_code}1", label1, huffman_code_generation(nodes, "#{curr_code}0", label2, acc))
    end
    
  end

  def huffman(nodes) do
    unchecked_nodes = Enum.filter(nodes, fn {_label, _prob, _ch1, _ch2, checked} -> checked == False end)
    if length(unchecked_nodes) == 2 do
      [a, b] = unchecked_nodes
      {label1, prob1, _ch11, _ch12, _checked} = a
      {label2, prob2, _ch21, _ch22, _checked} = b
      [{[label1 | label2], prob1 + prob2, a, b, True} | nodes]
    else
      [min1, min2] = unchecked_nodes
                      |> Enum.sort_by(fn {_label, prob, _ch1, _ch2, _checked} -> prob end)
                      |> Enum.take(2)

      {label1, prob1, ch11, ch12, _checked} = min1
      {label2, prob2, ch21, ch22, _checked} = min2

      min1 = {label1, prob1, ch11, ch12, True}
      min2 = {label2, prob2, ch21, ch22, True}
      new_node = {[label1 | label2], prob1 + prob2, min1, min2, False}
    
      huffman([min1, min2, new_node | Enum.filter(nodes, fn {label, _prob, _ch1, _ch2, _checked} -> label != label1 && label != label2 end)])
    end
  end
end
