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
              #|> Enum.sort_by(fn {_char, prob} -> prob end, &>=/2) --> somehow sorting decreases decoding quality
    IO.inspect(probs)
    segments = build_segment(probs, 0.0, [])
    IO.inspect(segments)
    encoded_text = encode_text(String.graphemes(contents), segments, 0.0, 1.0)
    IO.inspect(encoded_text)
    decoded_text = decode_text(encoded_text, segments, String.length(contents), "")
    IO.inspect(decoded_text)
    IO.puts("Compression ratio = #{String.length(Float.to_string(encoded_text)) / String.length(contents) * 100} %")
  end

  def build_segment(probs, border, segments) do
    if length(probs) == 1 do
      [{char, _prob} | _] = probs
      [{border, 1.0, char} | segments]
    else
      [{char, prob} | rest_probs] = probs
      build_segment(rest_probs, border + prob, [{border, border + prob, char} | segments])
    end
  end

  def encode_text(text, segments, left, right) do
    if length(text) == 1 do
      [ char ] = text
      {seg_left, _seg_right, _char} = Enum.find(segments, fn {_l, _r, c} -> c == char end)
      left + (right - left) * seg_left
    else
      [ char | rest_text ] = text
      {seg_left, seg_right, _char} = Enum.find(segments, fn {_l, _r, c} -> c == char end)
      encode_text(rest_text, segments, left + (right - left) * seg_left, left + (right - left) * seg_right)
    end
  end

  def decode_text(encoded_text, segments, char_count, decoded_text) do
    if char_count == 0 do
      decoded_text
    else
      {seg_left, seg_right, seg_char} = Enum.find(segments, fn {l, r, _c} -> l <= encoded_text && encoded_text < r end)
      decode_text((encoded_text - seg_left) / (seg_right - seg_left), segments, char_count - 1, '#{decoded_text}#{seg_char}')
    end
  end
end
