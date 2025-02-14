from bs4 import BeautifulSoup

with open("sample.html", "r", encoding="utf-8") as file:
    html_content = file.read()

soup = BeautifulSoup(html_content, "html.parser")

first_paragraph = soup.find("p").text

print("Scraped Paragraph:")
print(first_paragraph)