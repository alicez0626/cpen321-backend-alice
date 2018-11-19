const query = jest.fn()
.mockImplementationOnce( () => {
  return Promise.resolve({affectedRows: 1});
})
.mockImplementationOnce( () => {
  // get profile with valid userId, return profile[]
  return Promise.resolve([{result:"Fake profile"}]);
})
.mockImplementationOnce( () => {
  // get profile with invalid userId, return empty profile[]
  return Promise.resolve([]);
})

module.exports = {
  query
}
