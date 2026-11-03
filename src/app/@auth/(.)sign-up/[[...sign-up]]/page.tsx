import { SignUp } from '@clerk/nextjs'
import { Modal } from '@/ui/modal'

export default function Page() {
  return (
    <Modal>
      <SignUp routing="hash" signInUrl="/sign-in" fallbackRedirectUrl="/" />
    </Modal>
  )
}
