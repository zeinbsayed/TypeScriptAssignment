///////Part A - System: Simple Notes Management System///////////////////////

///////////////////////////1. Base Class – User////////////////////////////////
class User {
  private Id: number;
  public name: string;
  protected email: string;
  private Password: string;
  protected Phone: string;
  private _age: number;
  private notebooks: NoteBook[] = []
  constructor(
    Id: number,
    name: string,
    email: string,
    Password: string,
    Phone: string,
    age: number
  ) {
    this.Id = Id;
    this.name = name;
    this.email = email;
    this.Password = Password;
    this.Phone = Phone;
    this._age = User.validateAge(age);
  }

  // validate age if >18||<60
  private static validateAge(age: number): number {
    if (age < 18 || age > 60) {
      throw new Error("Age must be between 18 and 60");
    }
    return age;
  }
  //get id value 
    get id(): number {
    return this.Id;
  }
  // Get value of age     
  public get age(): number {
    return this._age;
  }
  //set value of age 
  public set age(value: number) {
    this._age = User.validateAge(value);
  }

  // printing user information  
  public displayInfo(): void {
    console.log(`User Information:
  Id: ${this.Id}
  Name: ${this.name}
  Email: ${this.email}
  Phone: ${this.Phone}
  Age: ${this._age}`);
  }
   addNotebook(notebook: NoteBook): void {
    if (this.notebooks.includes(notebook)) {
      console.log(`Notebook "${notebook.name}" already added`);
      return;
    }
    this.notebooks.push(notebook);
    console.log(`Notebook "${notebook.name}" added to ${this.name}`);
  }

  //////////// 5. Aggregation – User and NoteBook ////////////

  removeNotebook(notebook: NoteBook): boolean {
    const before = this.notebooks.length;
    this.notebooks = this.notebooks.filter(n => n !== notebook);
    const removed = this.notebooks.length < before;
    console.log(
      removed
        ? `Notebook "${notebook.name}" removed from ${this.name}`
        : `Notebook "${notebook.name}" not found`
    );
    return removed;
  }

  getNotebooks(): NoteBook[] {
    return [...this.notebooks]; 
  }
}

const user = new User(1, "Zeinb", "zeinb@gmail.com", "Ze@123", "010258485698", 20);
user.displayInfo();
//////////////////////////////////////////////////////////////////////////////////
/////////////////2. Inheritance – Admin User////////////////////////////

type NoteAction = "add" | "view" | "update" | "delete";

class Admin extends User {
  private notes: string[] = [];    

  constructor(
    Id: number,
    name: string,
    email: string,
    Password: string,
    Phone: string,
    age: number,
    public role: string
  ) {
    super(Id, name, email, Password, Phone, age); 
  }

  // manage notes :  
  manageNotes(action: NoteAction, note?: string, index?: number): void {
    switch (action) {
      case "add":
        if (!note) return console.log("Note text is required");
        this.notes.push(note);
        console.log(`Note added: ${note}`);
        break;

      case "view":
        if (this.notes.length === 0) return console.log("No notes yet");
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
  displayInfo(): void {
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
  constructor(
    public Id: number,
    public title: string,
    public content: string,
    public author: User   
  ) {}

  get authorId(): number {
    return this.author.id;
  }

  get authorName(): string {
    return this.author.name;
  }

  preview(length: number = 20): string {
    return this.content.length > length
      ? this.content.substring(0, length) + "..."
      : this.content;
  }

  display(): void {
    console.log(`Note #${this.Id} "${this.title}" by ${this.authorName}`);
  }
}

const note = new Note(1, "Meeting", "Discuss the project deadline and assign tasks to the team", user);
note.display();
console.log(note.authorId);
///////////////////////////////////////////////////////////////////////////////////
/////////////////////////4. Composition– NoteBook and Notes///////////////////
class NoteBook {
  private notes: Note[] = [];   
  private nextId: number = 1;

  constructor(public name: string, public owner: User) {}

  // add note
  addNote(tittle: string, content: string): Note {
    const note = new Note(this.nextId++, tittle, content, this.owner);
    this.notes.push(note);
    console.log(`Note added: ${note.title}`);
    return note;
  }

  removeNote(id: number): boolean {
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
book.removeNote(99);   // not fou

//////////////////////////////////////////////////////////////////////////////////////////
const book1 = new NoteBook("Work", user);
const book2 = new NoteBook("Personal", user);

user.addNotebook(book1);
user.addNotebook(book2);

console.log(user.getNotebooks().length); 

user.removeNotebook(book1);
console.log(book1.name);

//////////////////////////////
class Storage<T> {
  private items: T[] = [];

  // ///////////////////////7. Generics– Data Storage /////////////////////////////////
  addItem(item: T): void {
    this.items.push(item);
  }

  //  
  removeItem(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index === -1) {
      return false; //   
    }
    this.items.splice(index, 1);
    return true;
  }
    
  getAllItems(): T[] {
    return [...this.items]; //     
  }

}
//testing storage class by numbers/////////////
const numbers = new Storage<number>();
numbers.addItem(10);
numbers.addItem(20);
numbers.addItem(30);
console.log("Numbers after add:", numbers.getAllItems()); 
console.log("Remove 20:", numbers.removeItem(20));        
console.log("Remove 99:", numbers.removeItem(99));       
console.log("Numbers after remove:", numbers.getAllItems()); 

//testing storage class by strings/////////////
const words = new Storage<string>();
words.addItem("Hello");
words.addItem("World");
console.log("Words:", words.getAllItems()); 
console.log("Remove World:", words.removeItem("World"));        
console.log("Remove Hii:", words.removeItem("Hii"));       
console.log("Words after remove:", words.getAllItems()); 

// testing by usings class
interface Book {
  title: string;
  author: string;
}

const books = new Storage<Book>();
const book4: Book = { title: "Clean Code", author: "Robert Martin" };
const book5: Book = { title: "TypeScript ", author: "Microsoft" };

books.addItem(book4);
books.addItem(book5);
console.log("Books:", books.getAllItems());

books.removeItem(book4); 
console.log("Books after remove:", books.getAllItems());

const copy = numbers.getAllItems();
copy.push(999);
console.log("Original untouched copy:", numbers.getAllItems()); 

//









////////////////////////////////////
export {};