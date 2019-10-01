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
    
    res = shenon_fano("", probs, [])
    IO.inspect(res)
  end

  def shenon_fano(key, data, acc) do
    if length(data) == 1 do
      [{key, data} | acc]
    else
      {left, right} = shenon_fano_separation(data, [], [])
      shenon_fano("#{key}0", left, shenon_fano("#{key}1", right, acc))
    end
  end

  def shenon_fano_separation(data, left, right) do
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
        shenon_fano_separation(rest, [element | left], right)
      else
        shenon_fano_separation(rest, left, [element | right])
      end
    end
  end
end
