const users = [];

function User(id, username, roomvalue) {

  let vice_pre = true;
  users.filter((Element) => {
    if (Element.username == username) {
      vice_pre = false;
    }
  });


  const user = { id, username, roomvalue, userSet: new Set() };
  if(vice_pre == true){
    users.push(user);
    return user;
  }else{
    return "Username already exists"
  }

}

function update_word_function(socketID, typedText) {
  let single_user = users.filter((el, ind) => {

    if (el.id == socketID) {
      if (!el.userSet.has(typedText)) {
        el.userSet.add(typedText);
        el.wordCount = el.userSet.size;
      }
      return el;
      
    }
  });

  if (single_user.length === 0) {
    const newUser = {
      id: socketID,
      userSet: new Set([typedText]),
      wordCount: 1,
      roomvalue: "default_room", // Set a default value for roomvalue
    };
    users.push(newUser);
    return [newUser]; // Return an array containing the newly created user
  }

  return single_user;
}

// console.log(one_user);

module.exports = { User, update_word_function, users };
