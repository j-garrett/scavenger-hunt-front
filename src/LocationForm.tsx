import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

type FormValues = {
  location: string
  clue: string
  solution: string
  radius: number
}
type LocationFormProps = {
  onSubmit: SubmitHandler<FormValues>
  radius: number
  onRadiusChange: (radius: number) => void
}

const LocationForm: React.FC<LocationFormProps> = ({
  onSubmit,
  radius,
  onRadiusChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          Location:
          <input {...register('location', { required: true })} />
        </label>
        {errors.location && <span>This field is required</span>}
      </div>
      <div>
        <label>
          Clue:
          <input id="clue" {...register('clue', { required: true })} />
          {errors.clue && <span>This field is required</span>}
        </label>
      </div>
      <div>
        <label>
          Solution:
          <input id="solution" {...register('solution', { required: true })} />
          {errors.solution && <span>This field is required</span>}
        </label>
      </div>
      <div>
        <label>
          Radius (meters):
          <input
            id="radius"
            type="number"
            value={radius}
            onChange={e => onRadiusChange(Number(e.target.value))}
          />
          {errors.radius && <span>This field is required</span>}
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default LocationForm
