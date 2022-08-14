const sleep = (time) => {
  return new Promise(r => setTimeout(r, time))
}

export default sleep;