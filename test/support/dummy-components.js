export default function DummyComponent() { return <div />; }
export function ErrorComponent({createError, ...props}) {
  if(createError) { throw createError(props); }

  return <div />;
}
export function OtherComponent() { return <div />; }
