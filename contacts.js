const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve(__dirname, "db", "contacts.json");

function listContacts() {
  getAllContacts()
    .then((parsedResponse) => console.table(parsedResponse))
    .catch((error) => console.log(error));
}

function getContactById(contactId) {
  getAllContacts()
    .then((parsedResponse) => {
      const contact = parsedResponse.find(({ id }) => id === +contactId);

      if (!contact) {
        throw new Error(`Контакта с ID: '${contactId}' не существует!`);
      }

      console.log(contact);
    })
    .catch((error) => console.log(error));
}

function removeContact(contactId) {
  getAllContacts()
    .then((parsedResponse) => {
      const deletedContact = parsedResponse.find(({ id }) => id === +contactId);

      if (!deletedContact) {
        throw new Error(`Контакта с ID: '${contactId}' не существует!`);
      }

      const changedContactList = parsedResponse.filter(
        ({ id }) => id !== +contactId
      );

      updateContacts(contactsPath, changedContactList);
      console.log(`Контакта с ID: '${contactId}' успешно удален!`);
    })
    .catch((error) => console.log(error));
}

function addContact(name, email, phone) {
  getAllContacts()
    .then((parsedResponse) => {
      const id = parsedResponse.length + 1;
      const changedContact = { id, name, email, phone };
      const isRepeatedContact = parsedResponse.some(
        (contact) =>
          contact.name.toLowerCase() === name.toLowerCase() ||
          contact.email.toLowerCase() === email.toLowerCase() ||
          contact.phone === phone
      );

      if (isRepeatedContact) {
        throw new Error(
          "Контакт с такой персональной информацией уже существует!"
        );
      }

      const changedContactList = [...parsedResponse, changedContact];
      updateContacts(contactsPath, changedContactList);

      console.log(`Контакт: '${name}' успешно добавлен!`);
    })
    .catch((error) => console.log(error));
}

async function getAllContacts() {
  return await fs
    .readFile(contactsPath)
    .then((response) => JSON.parse(response));
}

async function updateContacts(path, changedContactList) {
  return await fs.writeFile(
    path,
    JSON.stringify(changedContactList, null, " ")
  );
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
