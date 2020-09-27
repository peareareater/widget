async function createUser(id) {
    const user = new User();
    user.id = id;
    await user.save();
}