defmodule Lab3 do
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
              |> Enum.sort_by(fn {_char, prob} -> prob end, &>=/2)
    IO.inspect(probs)
    segments = build_segment(probs, 0.0, [])
    IO.inspect(segments)
  end

  def build_segment(probs, border, segments) do
    if length(probs) == 1 do
      [{char, prob} | _] = probs
      [{border, border + prob, char} | segments]
    else
      [{char, prob} | rest_probs] = probs
      build_segment(rest_probs, border + prob, [{border, border + prob, char} | segments])
    end
  end
end
