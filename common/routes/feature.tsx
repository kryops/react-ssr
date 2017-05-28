import * as React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'

const placeholder: React.ReactElement<any>[] = []

for(let i = 0; i < 100; i++) {
    placeholder.push(<p key={i}>...</p>)
}

const Feature: React.SFC<{}> = () => (
    <StickyContainer>
        <div>
            <Sticky>
                {({ style }: any) => <h1 style={style}>Feature: Sticky</h1>}
            </Sticky>
            {placeholder}
        </div>
    </StickyContainer>
)

export default Feature
