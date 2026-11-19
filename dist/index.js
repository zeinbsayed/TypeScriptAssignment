"use strict";
///////Part A - System: Simple Notes Management System///////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
///////////////////////////1. Base Class – User////////////////////////////////
class User {
    Id;
    name;
    email;
    Password;
    Phone;
    _age;
    notebooks = [];
    constructor(Id, name, email, Password, Phone, age) {
        this.Id = Id;
        this.name = name;
        this.email = email;
        this.Password = Password;
        this.Phone = Phone;
        this._age = User.validateAge(age);
    }
    // validate age if >18||<60
    static validateAge(age) {
        if (age < 18 || age > 60) {
            throw new Error("Age must be between 18 and 60");
        }
        return age;
    }
    //get id value 
    get id() {
        return this.Id;
    }
    // Get value of age     
    get age() {
        return this._age;
    }
    //set value of age 
    set age(value) {
        this._age = User.validateAge(value);
    }
    // printing user information  
    displayInfo() {
        console.log(`User Information:
  Id: ${this.Id}
  Name: ${this.name}
  Email: ${this.email}
  Phone: ${this.Phone}
  Age: ${this._age}`);
    }
    addNotebook(notebook) {
        if (this.notebooks.includes(notebook)) {
            console.log(`Notebook "${notebook.name}" already added`);
            return;
        }
        this.notebooks.push(notebook);
        console.log(`Notebook "${notebook.name}" added to ${this.name}`);
    }
    //////////// 5. Aggregation – User and NoteBook ////////////
    removeNotebook(notebook) {
        const before = this.notebooks.length;
        this.notebooks = this.notebooks.filter(n => n !== notebook);
        const removed = this.notebooks.length < before;
        console.log(removed
            ? `Notebook "${notebook.name}" removed from ${this.name}`
            : `Notebook "${notebook.name}" not found`);
        return removed;
    }
    getNotebooks() {
        return [...this.notebooks];
    }
}
const user = new User(1, "Zeinb", "zeinb@gmail.com", "Ze@123", "010258485698", 20);
user.displayInfo();
class Admin extends User {
    role;
    notes = [];
    constructor(Id, name, email, Password, Phone, age, role) {
        super(Id, name, email, Password, Phone, age);
        this.role = role;
    }
    // manage notes :  
    manageNotes(action, note, index) {
        switch (action) {
            case "add":
                if (!note)
                    return console.log("Note text is required");
                this.notes.push(note);
                console.log(`Note added: ${note}`);
                break;
            case "view":
                if (this.notes.length === 0)
                    return console.log("No notes yet");
                this.notes.forEach((n, i) => console.log(`${i}: ${n}`));
                break;
            case "update":
                if (!note || index === undefined || !this.notes[index])
                    return console.log("Valid index and note text are required");
                this.notes[index] = note;
                console.log(`Note ${index} updated`);
                break;
            case "delete":
                if (index === undefined || !this.notes[index])
                    return console.log("Valid index is required");
                this.notes.splice(index, 1);
                console.log(`Note ${index} deleted`);
                break;
        }
    }
    // display information 
    displayInfo() {
        super.displayInfo();
        console.log(`Role: ${this.role}, Notes count: ${this.notes.length}`);
    }
}
const admin = new Admin(1, "Zeinb", "zeinb@gmail.com", "Ze@123", "010258485698", 30, "Manager");
admin.manageNotes("add", "Review user accounts");
admin.manageNotes("add", "Update system settings");
admin.manageNotes("view");
admin.manageNotes("update", "Review all accounts", 0);
admin.manageNotes("delete", undefined, 1);
admin.manageNotes("view");
admin.displayInfo();
////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////3. Class - Note/////////////////////////////////
// 6. Association: every Note is linked to its author (a User).
class Note {
    Id;
    title;
    content;
    author;
    constructor(Id, title, content, author) {
        this.Id = Id;
        this.title = title;
        this.content = content;
        this.author = author;
    }
    get authorId() {
        return this.author.id;
    }
    get authorName() {
        return this.author.name;
    }
    preview(length = 20) {
        return this.content.length > length
            ? this.content.substring(0, length) + "..."
            : this.content;
    }
    display() {
        console.log(`Note #${this.Id} "${this.title}" by ${this.authorName}`);
    }
}
const note = new Note(1, "Meeting", "Discuss the project deadline and assign tasks to the team", user);
note.display();
console.log(note.authorId);
///////////////////////////////////////////////////////////////////////////////////
/////////////////////////4. Composition– NoteBook and Notes///////////////////
class NoteBook {
    name;
    owner;
    notes = [];
    nextId = 1;
    constructor(name, owner) {
        this.name = name;
        this.owner = owner;
    }
    // add note
    addNote(tittle, content) {
        const note = new Note(this.nextId++, tittle, content, this.owner);
        this.notes.push(note);
        console.log(`Note added: ${note.title}`);
        return note;
    }
    removeNote(id) {
        const before = this.notes.length;
        this.notes = this.notes.filter(n => n.Id !== id);
        const removed = this.notes.length < before;
        console.log(removed ? `Note #${id} removed` : `Note #${id} not found`);
        return removed;
    }
}
const book = new NoteBook("My Notes", user);
book.addNote("Meeting", "Discuss the project deadline and assign tasks to the team");
book.addNote("Todo", "Buy milk");
book.removeNote(1);
book.removeNote(99); // not fou
//////////////////////////////////////////////////////////////////////////////////////////
const book1 = new NoteBook("Work", user);
const book2 = new NoteBook("Personal", user);
user.addNotebook(book1);
user.addNotebook(book2);
console.log(user.getNotebooks().length);
user.removeNotebook(book1);
console.log(book1.name);
//////////////////////////////
class Storage {
    items = [];
    // ///////////////////////7. Generics– Data Storage /////////////////////////////////
    addItem(item) {
        this.items.push(item);
    }
    //  
    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index === -1) {
            return false; //   
        }
        this.items.splice(index, 1);
        return true;
    }
    getAllItems() {
        return [...this.items]; //     
    }
}
//testing storage class by numbers/////////////
const numbers = new Storage();
numbers.addItem(10);
numbers.addItem(20);
numbers.addItem(30);
console.log("Numbers after add:", numbers.getAllItems());
console.log("Remove 20:", numbers.removeItem(20));
console.log("Remove 99:", numbers.removeItem(99));
console.log("Numbers after remove:", numbers.getAllItems());
//testing storage class by strings/////////////
const words = new Storage();
words.addItem("Hello");
words.addItem("World");
console.log("Words:", words.getAllItems());
console.log("Remove World:", words.removeItem("World"));
console.log("Remove Hii:", words.removeItem("Hii"));
console.log("Words after remove:", words.getAllItems());
const books = new Storage();
const book4 = { title: "Clean Code", author: "Robert Martin" };
const book5 = { title: "TypeScript ", author: "Microsoft" };
books.addItem(book4);
books.addItem(book5);
console.log("Books:", books.getAllItems());
books.removeItem(book4);
console.log("Books after remove:", books.getAllItems());
const copy = numbers.getAllItems();
copy.push(999);
console.log("Original untouched copy:", numbers.getAllItems());
//# sourceMappingURL=index.js.map