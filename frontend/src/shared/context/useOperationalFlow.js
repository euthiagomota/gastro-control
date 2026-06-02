import { useContext } from 'react';
import OperationalFlowContext from './OperationalFlowContextValue';

export default function useOperationalFlow() {
  const context = useContext(OperationalFlowContext);

  if (!context) {
    throw new Error('useOperationalFlow must be used within an OperationalFlowProvider');
  }

  return context;
}
