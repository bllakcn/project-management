import Avatar from "boring-avatars"

export default function DisplayAvatar({ name, size }) {
  return (
    <Avatar
      size={size}
      name={name}
      variant='bauhaus'
      colors={['#A34D65','#FFE391','#9FBA9E','#DFE7B6','#516A9D']}
    />
  )
}
