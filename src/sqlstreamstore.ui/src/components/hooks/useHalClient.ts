import { useState } from 'react';
import { getHalClient } from '../../services/hal';

const useHalClient = () => {
  const [halState] = useState(getHalClient());
  return halState;
}

export default useHalClient;
