defmodule Lab2 do
  def main(args \\ []) do
    IO.puts("Hello stranger!")
    filename = IO.gets("Enter file name: ")
                |> String.replace("\n", "")
    IO.puts(filename)
    {res, contents} = File.read(filename)
    case res do
      :error -> IO.puts("Error occured:\\")
      :ok -> IO.puts(contents)
    end
  end
end
