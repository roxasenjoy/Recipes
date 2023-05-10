from selenium.webdriver.chrome.options import Options
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import sqlite3

conn = sqlite3.connect('dbs.db')
cur = conn.cursor()

driverPath = 'chromedriver'

chrome_options = Options()
chrome_options.add_experimental_option("detach", True)
driver = webdriver.Chrome(executable_path=driverPath, chrome_options=chrome_options)
# driver.execute_cdp_cmd('Network.setUserAgentOverride', {"userAgent":"teo", "platform":"Windows"})

url = "https://www.quitoque.fr/votre-premier-panier"
driver.get(url)
agent = driver.execute_script("return navigator.userAgent")
driver.implicitly_wait(10)

# Trouver toutes les balises <A> qui contiennent la classe "dRraUa"
elements = driver.find_elements(by='css selector', value='a.dRraUa')

recipes_href_list = []

# Récupération de tous les URLs sur lesquels boucler
for element in elements:
    href = element.get_attribute("href")
    recipes_href_list.append(href)

# Fermer le navigateur
driver.quit()


for url in recipes_href_list:
    print(url)
    print('url')

    driver = webdriver.Chrome()
    driver.get(url)

    try:
        # Attend jusqu'à 10 secondes que la page soit complètement chargée
        print('try')
        element = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "dBXpHX"))
        )

    finally:
        print('fin')
        # Ajouter le titre de la recette
        titre_recette = driver.find_element(by='css selector', value='h2.jNNXFk')
        cur.execute("INSERT INTO recette (name) VALUES (?)", (titre_recette.text,))
        last_id_generated = cur.lastrowid
        print(last_id_generated)
        conn.commit()

        # Ajouter la liste des ingrédients
        liste_ingredients = driver.find_elements(by='css selector', value='div.dBXpHX')
        for ingredient in liste_ingredients:
            cur.execute("INSERT INTO ingredients (id_recette, name) VALUES (?, ?)",
                        (last_id_generated, ingredient.text))
            conn.commit()

        # Ajouter la description de la recette
        step = 0
        liste_description = driver.find_elements(by='css selector', value='div.kMYLSy')
        for description in liste_description:
            step += 1
            cur.execute("INSERT INTO instructions (id_recette ,step ,instructions) VALUES (?, ?, ?)",
                        (last_id_generated, step, description.text))
            conn.commit()
        continue
    break
