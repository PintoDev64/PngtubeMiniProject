export function WindowAPI() {
    const { Close, MinMax, Minimize } = window.api.Window;
    return {
        CloseWindow: Close,
        MinMaxWindow: MinMax,
        MinimizeWindow: Minimize
    }
}

export function ActionAPI() {
    const { LoadImage, CreateModel } = window.api.Action
    return {
        LoadImage,
        CreateModel
    }
}