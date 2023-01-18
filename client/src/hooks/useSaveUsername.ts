export const useSaveUserName = (name: string): void => {
  localStorage.setItem('username', name)
}
