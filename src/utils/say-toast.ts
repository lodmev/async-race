export default function sayToast(toastElement: HTMLElement) {
  let showing = false;
  const messageQueue = Array<[string, boolean]>();
  const msgElement = toastElement;
  function updateMsg() {
    if (showing) return;
    const nextMessage = messageQueue.pop();
    if (nextMessage) {
      const [msg, isError] = nextMessage;
      msgElement.innerText = msg;
      msgElement.classList.toggle('error', isError);
      msgElement.classList.add('visible');
    } else {
      msgElement.classList.remove('visible');
    }
  }
  msgElement.addEventListener('animationstart', () => {
    showing = true;
  });
  msgElement.addEventListener('animationiteration', () => {
    showing = false;
    msgElement.classList.remove('visible');
    updateMsg();
  });
  return function say(message: unknown, error = false) {
    const msg =
      message && message.toString !== Object.prototype.toString
        ? // eslint-disable-next-line @typescript-eslint/no-base-to-string
          message.toString()
        : 'message';
    messageQueue.push([msg, error]);

    updateMsg();
  };
}
