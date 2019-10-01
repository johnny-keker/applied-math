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
    
    {left, right} = shenon_fano(probs, [], [])
    
    IO.puts("Left:")
    left
    |> Enum.each(fn {x, y} -> IO.puts("#{x} => #{y}") end)
    IO.puts("Right:")
    right
    |> Enum.each(fn {x, y} -> IO.puts("#{x} => #{y}") end)
  end

  def shenon_fano(data, left, right) do
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
        shenon_fano(rest, [element | left], right)
      else
        shenon_fano(rest, left, [element | right])
      end
    end
  end
end
