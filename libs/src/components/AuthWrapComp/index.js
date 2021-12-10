const AuthWrapComp = ({ children, authFunc }) => {
  if (authFunc && authFunc()) {
    return children;
  }
  return null;
};

export default AuthWrapComp;
