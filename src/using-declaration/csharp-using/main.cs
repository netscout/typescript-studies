using System.IO;

var buffer = new char[50];
using (var reader = new StreamReader("text.txt"))
{
  int charsRead = 0;
  while (reader.Peek() != -1)
  {
    charsRead = reader.Read(buffer, 0, buffer.Length);
    Console.Write(buffer, 0, charsRead);
  }
}