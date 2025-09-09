struct Point {
    x: Int;
    y: Int;  
    z: Int;
}

contract Test {
    init() {}
    
    fun test() {
        let pt: Point = Point{ x: 1, y: 2, z: 3 };
        let Point{ x1, y, z } = pt; // Should suggest "x" 
    }
    
    receive() {}
}