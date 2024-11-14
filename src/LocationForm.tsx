import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

type FormValues = {
    location: string
    clue: string
    solution: string
}

const LocationForm: React.FC<{ onSubmit: SubmitHandler<FormValues> }> = ({
    onSubmit,
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
                <label htmlFor="clue">Clue:</label>
                <input id="clue" {...register('clue', { required: true })} />
                {errors.clue && <span>This field is required</span>}
            </div>
            <div>
                <label htmlFor="solution">Solution:</label>
                <input
                    id="solution"
                    {...register('solution', { required: true })}
                />
                {errors.solution && <span>This field is required</span>}
            </div>
            <button type="submit">Submit</button>
        </form>
    )
}

export default LocationForm
