import { useState } from 'react';
import { getHalClient } from '../../services/hal';

const usePrevious = () => {
  const [halState] = useState(getHalClient());
  return halState;
}

export default usePrevious;
