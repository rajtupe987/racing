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

  // console.log(one_user);
  // console.log(users);
  return single_user;
}

// console.log(one_user);

module.exports = { User, update_word_function, users };
