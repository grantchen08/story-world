import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from PIL import Image, ImageTk
import json
import os
import pyperclip

class SpriteAligner(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Sprite Sheet Aligner")
        self.geometry("1200x800")

        # Config
        self.view_scale = 1.0
        self.view_offset_x = 0
        self.view_offset_y = 0
        self.image_path = None
        self.original_image = None
        self.tk_image = None
        
        # State
        self.animations = [] # List of dicts
        self.selected_index = -1
        
        # Interaction State
        self.is_dragging = False
        self.drag_mode = None # 'pan', 'move', 'resize-nw', 'resize-ne', 'resize-sw', 'resize-se'
        self.drag_start_mouse = (0, 0)
        self.drag_start_anim = None # Snapshot of anim dict
        self.drag_start_view = (0, 0)

        self._setup_ui()
        
        # Default load
        default_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../public/assets/sprites/characters/char_black_man.png"))
        if os.path.exists(default_path):
            self.load_image(default_path)
            # Add default animations if empty
            if not self.animations:
                 self.animations = [
                    {'name': 'idle', 'x': 0, 'y': 0, 'w': 1408, 'h': 512, 'count': 4},
                    {'name': 'walk', 'x': 1408, 'y': 0, 'w': 1408, 'h': 512, 'count': 4},
                    {'name': 'combat', 'x': 0, 'y': 512, 'w': 1408, 'h': 512, 'count': 4},
                    {'name': 'singing', 'x': 1408, 'y': 512, 'w': 1408, 'h': 512, 'count': 4},
                    {'name': 'dancing', 'x': 0, 'y': 1024, 'w': 2816, 'h': 512, 'count': 8}
                ]
            self.refresh_list()
            self.select_anim(0)

    def _setup_ui(self):
        # Main layout
        main_paned = tk.PanedWindow(self, orient=tk.HORIZONTAL)
        main_paned.pack(fill=tk.BOTH, expand=True)

        # Sidebar
        sidebar = ttk.Frame(main_paned, width=300, padding=10)
        main_paned.add(sidebar)

        # File Controls
        file_frame = ttk.LabelFrame(sidebar, text="File")
        file_frame.pack(fill=tk.X, pady=5)
        ttk.Button(file_frame, text="Open Image", command=self.open_file_dialog).pack(fill=tk.X, padx=5, pady=5)

        # Animation List
        list_frame = ttk.LabelFrame(sidebar, text="Animations")
        list_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.anim_listbox = tk.Listbox(list_frame, exportselection=False)
        self.anim_listbox.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        self.anim_listbox.bind('<<ListboxSelect>>', self.on_list_select)

        btn_row = ttk.Frame(list_frame)
        btn_row.pack(fill=tk.X, padx=5, pady=5)
        ttk.Button(btn_row, text="+ Add", command=self.add_anim).pack(side=tk.LEFT, expand=True, fill=tk.X)
        ttk.Button(btn_row, text="- Delete", command=self.delete_anim).pack(side=tk.RIGHT, expand=True, fill=tk.X)

        # Properties
        prop_frame = ttk.LabelFrame(sidebar, text="Properties")
        prop_frame.pack(fill=tk.X, pady=5)
        
        self.vars = {
            'name': tk.StringVar(),
            'x': tk.DoubleVar(),
            'y': tk.DoubleVar(),
            'w': tk.DoubleVar(),
            'h': tk.DoubleVar(),
            'count': tk.IntVar(),
            'calc_w': tk.StringVar()
        }
        
        # Name
        ttk.Label(prop_frame, text="Name").grid(row=0, column=0, sticky='w', padx=5)
        ttk.Entry(prop_frame, textvariable=self.vars['name']).grid(row=0, column=1, sticky='ew', padx=5)
        self.vars['name'].trace_add('write', self.on_prop_change)

        # Coords
        ttk.Label(prop_frame, text="X").grid(row=1, column=0, sticky='w', padx=5)
        ttk.Entry(prop_frame, textvariable=self.vars['x']).grid(row=1, column=1, sticky='ew', padx=5)
        self.vars['x'].trace_add('write', self.on_prop_change)

        ttk.Label(prop_frame, text="Y").grid(row=2, column=0, sticky='w', padx=5)
        ttk.Entry(prop_frame, textvariable=self.vars['y']).grid(row=2, column=1, sticky='ew', padx=5)
        self.vars['y'].trace_add('write', self.on_prop_change)

        # Size
        ttk.Label(prop_frame, text="Width").grid(row=3, column=0, sticky='w', padx=5)
        ttk.Entry(prop_frame, textvariable=self.vars['w']).grid(row=3, column=1, sticky='ew', padx=5)
        self.vars['w'].trace_add('write', self.on_prop_change)

        ttk.Label(prop_frame, text="Height").grid(row=4, column=0, sticky='w', padx=5)
        ttk.Entry(prop_frame, textvariable=self.vars['h']).grid(row=4, column=1, sticky='ew', padx=5)
        self.vars['h'].trace_add('write', self.on_prop_change)

        # Count
        ttk.Label(prop_frame, text="Count").grid(row=5, column=0, sticky='w', padx=5)
        ttk.Entry(prop_frame, textvariable=self.vars['count']).grid(row=5, column=1, sticky='ew', padx=5)
        self.vars['count'].trace_add('write', self.on_prop_change)
        
        # Calculated
        ttk.Label(prop_frame, text="Frame W").grid(row=6, column=0, sticky='w', padx=5)
        ttk.Label(prop_frame, textvariable=self.vars['calc_w']).grid(row=6, column=1, sticky='w', padx=5)

        prop_frame.columnconfigure(1, weight=1)

        # Generate
        ttk.Button(sidebar, text="Generate & Copy JSON", command=self.generate_json).pack(fill=tk.X, pady=5)
        ttk.Button(sidebar, text="Update JSON File", command=self.save_json_file).pack(fill=tk.X, pady=5)

        # Canvas Area
        canvas_frame = ttk.Frame(main_paned)
        main_paned.add(canvas_frame)

        self.canvas = tk.Canvas(canvas_frame, bg='#2a2a2a', highlightthickness=0)
        self.canvas.pack(fill=tk.BOTH, expand=True)

        # Events
        self.canvas.bind('<ButtonPress-1>', self.on_mouse_down)
        self.canvas.bind('<B1-Motion>', self.on_mouse_drag)
        self.canvas.bind('<ButtonRelease-1>', self.on_mouse_up)
        
        self.canvas.bind('<ButtonPress-2>', self.start_pan) # Middle click
        self.canvas.bind('<B2-Motion>', self.do_pan)
        
        # Mouse wheel (Linux: Button 4/5, Windows/Mac: MouseWheel)
        self.canvas.bind('<Button-4>', lambda e: self.zoom(e, 1.1))
        self.canvas.bind('<Button-5>', lambda e: self.zoom(e, 0.9))
        self.canvas.bind('<MouseWheel>', self.on_mouse_wheel)

    def load_image(self, path):
        self.image_path = path
        try:
            self.original_image = Image.open(path)
            # Initial fit
            self.update_idletasks()
            cw = self.canvas.winfo_width() or 800
            ch = self.canvas.winfo_height() or 600
            
            w, h = self.original_image.size
            scale_w = cw / w
            scale_h = ch / h
            self.view_scale = min(scale_w, scale_h) * 0.9
            self.view_offset_x = (cw - w * self.view_scale) / 2
            self.view_offset_y = (ch - h * self.view_scale) / 2
            
            # Load JSON if exists
            base, _ = os.path.splitext(path)
            json_path = base + ".json"
            if os.path.exists(json_path):
                self.load_animations_from_json(json_path)
            else:
                self.animations = []

            self.refresh_list()
            if self.animations:
                self.select_anim(0)
            
            self.redraw()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load image: {e}")

    def load_animations_from_json(self, json_path):
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
            
            frames = data.get('frames', {})
            # Group frames by prefix
            groups = {}
            for key, frame_data in frames.items():
                # Assume format name_index
                if '_' in key:
                    parts = key.rsplit('_', 1)
                    if len(parts) == 2 and parts[1].isdigit():
                        name = parts[0]
                        idx = int(parts[1])
                        
                        f = frame_data['frame']
                        if name not in groups:
                            groups[name] = []
                        groups[name].append({'idx': idx, 'frame': f})
            
            self.animations = []
            for name, frame_list in groups.items():
                if not frame_list: continue
                # Sort by index
                frame_list.sort(key=lambda x: x['idx'])
                
                # Determine strip bounds
                min_x = min(f['frame']['x'] for f in frame_list)
                min_y = min(f['frame']['y'] for f in frame_list)
                
                # Assuming uniform sizing for now or taking max bounds
                # To reconstruct the strip width, we need to sum widths? 
                # Or if it's a grid... 
                # Our tool assumes a strip.
                # Total width = (last_x + last_w) - min_x ?
                # Or just sum of widths if they are contiguous?
                # Let's take (max_x + max_w) - min_x
                max_x = max(f['frame']['x'] + f['frame']['w'] for f in frame_list)
                max_y = max(f['frame']['y'] + f['frame']['h'] for f in frame_list)
                
                total_w = max_x - min_x
                total_h = max_y - min_y
                count = len(frame_list)
                
                self.animations.append({
                    'name': name,
                    'x': min_x,
                    'y': min_y,
                    'w': total_w,
                    'h': total_h,
                    'count': count
                })
                
        except Exception as e:
            print(f"Error loading JSON: {e}")

    def open_file_dialog(self):
        path = filedialog.askopenfilename(filetypes=[("Images", "*.png *.jpg *.jpeg")])
        if path:
            self.load_image(path)

    # --- Coordinate Transforms ---
    def to_screen(self, x, y):
        return (x * self.view_scale + self.view_offset_x, y * self.view_scale + self.view_offset_y)

    def to_world(self, x, y):
        return ((x - self.view_offset_x) / self.view_scale, (y - self.view_offset_y) / self.view_scale)

    # --- Rendering ---
    def redraw(self):
        self.canvas.delete("all")
        if not self.original_image:
            return

        # Resample image for display (performance optimization possible here, but for simple tool re-scaling each frame is ok-ish or just letting canvas handle it if image isn't huge)
        # Actually tk can't scale bitmaps well on the fly. Better to resize using PIL.
        
        # Viewport culling (rough)
        cw = self.canvas.winfo_width()
        ch = self.canvas.winfo_height()
        
        w, h = self.original_image.size
        sw, sh = int(w * self.view_scale), int(h * self.view_scale)
        
        if sw > 0 and sh > 0:
            # Re-create tk image only if scale changed significantly or pan
            # For responsiveness, we might just create one huge image if view_scale is 1, but for zooming we need to resample.
            # To avoid lag, maybe only resample when zoom changes, not every frame?
            # For this MVP, let's just resize.
            
            # Optimization: Crop visible area? For now, full image resize.
            resized = self.original_image.resize((sw, sh), Image.Resampling.NEAREST)
            self.tk_image = ImageTk.PhotoImage(resized)
            self.canvas.create_image(self.view_offset_x, self.view_offset_y, image=self.tk_image, anchor='nw')

        # Draw Animations
        self.ghost_images = []
        for idx, anim in enumerate(self.animations):
            is_selected = (idx == self.selected_index)
            color = '#00ff00' if is_selected else '#4a90e2'
            
            sx, sy = self.to_screen(anim['x'], anim['y'])
            sw, sh = anim['w'] * self.view_scale, anim['h'] * self.view_scale
            
            # Ghost overlay (transparent first frame repeated)
            count = max(1, anim['count'])
            if count > 1 and anim['w'] > 1 and anim['h'] > 1:
                frame_w = anim['w'] / count
                # Ensure source frame is within image bounds
                src_x, src_y = int(anim['x']), int(anim['y'])
                src_w, src_h = int(frame_w), int(anim['h'])
                img_w, img_h = self.original_image.size
                
                # Check if first frame is validly within image
                if src_x >= 0 and src_y >= 0 and src_x + src_w <= img_w and src_y + src_h <= img_h:
                    try:
                        frame_img = self.original_image.crop((src_x, src_y, src_x + src_w, src_y + src_h))
                        if frame_img.mode != 'RGBA':
                            frame_img = frame_img.convert('RGBA')
                        
                        # Apply 50% opacity
                        alpha = frame_img.getchannel('A')
                        alpha = alpha.point(lambda p: int(p * 0.5))
                        frame_img.putalpha(alpha)
                        
                        target_w = int(frame_w * self.view_scale)
                        target_h = int(anim['h'] * self.view_scale)
                        
                        if target_w > 0 and target_h > 0:
                            frame_resized = frame_img.resize((target_w, target_h), Image.Resampling.NEAREST)
                            ghost_photo = ImageTk.PhotoImage(frame_resized)
                            self.ghost_images.append(ghost_photo)
                            
                            for i in range(1, count):
                                gx = anim['x'] + i * frame_w
                                gsx, gsy = self.to_screen(gx, anim['y'])
                                self.canvas.create_image(gsx, gsy, image=ghost_photo, anchor='nw', tags=f"ghost_{idx}_{i}")
                    except Exception:
                        pass

            # Rect
            self.canvas.create_rectangle(sx, sy, sx+sw, sy+sh, outline=color, width=2 if is_selected else 1, tags=f"anim_{idx}")
            
            # Text
            if is_selected:
                self.canvas.create_text(sx, sy-10, text=f"{anim['name']} ({anim['count']}f)", fill=color, anchor='sw')

            # Split Lines
            count = max(1, anim['count'])
            frame_w = anim['w'] / count
            for i in range(1, count):
                lx = anim['x'] + i * frame_w
                lsx, _ = self.to_screen(lx, 0)
                self.canvas.create_line(lsx, sy, lsx, sy+sh, fill=color, dash=(2, 2) if not is_selected else None)

            # Resize Handles (if selected)
            if is_selected:
                hs = 8 # Handle size
                handles = [
                    (sx, sy, 'nw'),
                    (sx+sw, sy, 'ne'),
                    (sx, sy+sh, 'sw'),
                    (sx+sw, sy+sh, 'se')
                ]
                for hx, hy, cursor in handles:
                    self.canvas.create_rectangle(hx-hs/2, hy-hs/2, hx+hs/2, hy+hs/2, fill=color, outline='black', tags=f"handle_{cursor}")

    # --- Interaction Logic ---
    def select_anim(self, index):
        if 0 <= index < len(self.animations):
            self.selected_index = index
            self.anim_listbox.selection_clear(0, tk.END)
            self.anim_listbox.selection_set(index)
            self.load_prop_ui(index)
            self.redraw()
        else:
            self.selected_index = -1

    def on_list_select(self, event):
        sel = self.anim_listbox.curselection()
        if sel:
            self.select_anim(sel[0])

    def load_prop_ui(self, index):
        anim = self.animations[index]
        self._updating_vars = True
        self.vars['name'].set(anim['name'])
        self.vars['x'].set(anim['x'])
        self.vars['y'].set(anim['y'])
        self.vars['w'].set(anim['w'])
        self.vars['h'].set(anim['h'])
        self.vars['count'].set(anim['count'])
        
        fw = anim['w'] / max(1, anim['count'])
        self.vars['calc_w'].set(f"{fw:.2f}")
        self._updating_vars = False

    def on_prop_change(self, *args):
        if getattr(self, '_updating_vars', False):
            return
        if self.selected_index == -1:
            return
        
        try:
            anim = self.animations[self.selected_index]
            anim['name'] = self.vars['name'].get()
            anim['x'] = self.vars['x'].get()
            anim['y'] = self.vars['y'].get()
            anim['w'] = self.vars['w'].get()
            anim['h'] = self.vars['h'].get()
            anim['count'] = self.vars['count'].get()
            
            self.refresh_list(keep_selection=True)
            self.redraw()
        except ValueError:
            pass # Ignoring invalid input while typing

    def refresh_list(self, keep_selection=False):
        self.anim_listbox.delete(0, tk.END)
        for anim in self.animations:
            self.anim_listbox.insert(tk.END, anim['name'])
        if keep_selection and self.selected_index != -1:
            self.anim_listbox.selection_set(self.selected_index)

    def add_anim(self):
        cx, cy = self.to_world(self.canvas.winfo_width()/2, self.canvas.winfo_height()/2)
        new_anim = {
            'name': 'new_anim',
            'x': int(cx),
            'y': int(cy),
            'w': 352,
            'h': 512,
            'count': 1
        }
        self.animations.append(new_anim)
        self.refresh_list()
        self.select_anim(len(self.animations)-1)

    def delete_anim(self):
        if self.selected_index != -1:
            del self.animations[self.selected_index]
            self.selected_index = -1
            self.refresh_list()
            self.redraw()

    def generate_json_content(self):
        if not self.original_image:
            return None
        
        frames = {}
        for anim in self.animations:
            count = max(1, anim['count'])
            frame_w = anim['w'] / count
            for i in range(count):
                fx = anim['x'] + (i * frame_w)
                name = f"{anim['name']}_{i}"
                frames[name] = {
                    "frame": {
                        "x": int(round(fx)),
                        "y": int(round(anim['y'])),
                        "w": int(round(frame_w)),
                        "h": int(round(anim['h']))
                    },
                    "rotated": False,
                    "trimmed": False,
                    "spriteSourceSize": {
                        "x": 0,
                        "y": 0,
                        "w": int(round(frame_w)),
                        "h": int(round(anim['h']))
                    },
                    "sourceSize": {
                        "w": int(round(frame_w)),
                        "h": int(round(anim['h']))
                    }
                }
        
        output = {
            "frames": frames,
            "meta": {
                "app": "SpriteAligner_Python",
                "version": "1.0",
                "image": os.path.basename(self.image_path) if self.image_path else "sprite.png",
                "format": "RGBA8888",
                "size": {"w": self.original_image.width, "h": self.original_image.height},
                "scale": "1"
            }
        }
        return output

    def generate_json(self):
        output = self.generate_json_content()
        if output:
            json_str = json.dumps(output, indent=2)
            pyperclip.copy(json_str)
            messagebox.showinfo("Success", "JSON copied to clipboard!")

    def save_json_file(self):
        if not self.image_path:
            return
        
        output = self.generate_json_content()
        if not output:
            return

        base, _ = os.path.splitext(self.image_path)
        json_path = base + ".json"
        
        try:
            with open(json_path, 'w') as f:
                json.dump(output, f, indent=2)
            messagebox.showinfo("Success", f"Updated {os.path.basename(json_path)}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save JSON: {e}")

    # --- Mouse Events ---
    def on_mouse_down(self, event):
        wx, wy = self.to_world(event.x, event.y)
        
        # Check resize handles of selected
        if self.selected_index != -1:
            anim = self.animations[self.selected_index]
            sx, sy = self.to_screen(anim['x'], anim['y'])
            sw, sh = anim['w'] * self.view_scale, anim['h'] * self.view_scale
            
            hs = 12 # hit size
            if abs(event.x - sx) < hs and abs(event.y - sy) < hs:
                self.drag_mode = 'resize-nw'
            elif abs(event.x - (sx+sw)) < hs and abs(event.y - sy) < hs:
                self.drag_mode = 'resize-ne'
            elif abs(event.x - sx) < hs and abs(event.y - (sy+sh)) < hs:
                self.drag_mode = 'resize-sw'
            elif abs(event.x - (sx+sw)) < hs and abs(event.y - (sy+sh)) < hs:
                self.drag_mode = 'resize-se'
            
            if self.drag_mode:
                self.start_drag(event, anim)
                return

        # Check Hit Body
        # Check current selected first? Or check all?
        # Check selected first to allow moving overlapping boxes
        hit_index = -1
        
        def check_hit(idx):
            a = self.animations[idx]
            return (a['x'] <= wx <= a['x'] + a['w']) and (a['y'] <= wy <= a['y'] + a['h'])

        if self.selected_index != -1 and check_hit(self.selected_index):
            hit_index = self.selected_index
        else:
            # Check others
            for idx in range(len(self.animations)):
                if check_hit(idx):
                    hit_index = idx
                    break
        
        if hit_index != -1:
            self.select_anim(hit_index)
            self.drag_mode = 'move'
            self.start_drag(event, self.animations[hit_index])
        else:
            self.select_anim(-1)

    def start_drag(self, event, anim):
        self.is_dragging = True
        self.drag_start_mouse = (event.x, event.y)
        self.drag_start_anim = anim.copy()

    def on_mouse_drag(self, event):
        if not self.is_dragging:
            return
        
        anim = self.animations[self.selected_index]
        dx = (event.x - self.drag_start_mouse[0]) / self.view_scale
        dy = (event.y - self.drag_start_mouse[1]) / self.view_scale
        
        orig = self.drag_start_anim
        
        if self.drag_mode == 'move':
            anim['x'] = round(orig['x'] + dx)
            anim['y'] = round(orig['y'] + dy)
        elif self.drag_mode == 'resize-se':
            anim['w'] = max(1, round(orig['w'] + dx))
            anim['h'] = max(1, round(orig['h'] + dy))
        elif self.drag_mode == 'resize-sw':
            anim['x'] = round(orig['x'] + dx)
            anim['w'] = max(1, round(orig['w'] - dx))
            anim['h'] = max(1, round(orig['h'] + dy))
        elif self.drag_mode == 'resize-ne':
            anim['y'] = round(orig['y'] + dy)
            anim['w'] = max(1, round(orig['w'] + dx))
            anim['h'] = max(1, round(orig['h'] - dy))
        elif self.drag_mode == 'resize-nw':
            anim['x'] = round(orig['x'] + dx)
            anim['y'] = round(orig['y'] + dy)
            anim['w'] = max(1, round(orig['w'] - dx))
            anim['h'] = max(1, round(orig['h'] - dy))
            
        self.load_prop_ui(self.selected_index)
        self.redraw()

    def on_mouse_up(self, event):
        self.is_dragging = False
        self.drag_mode = None

    # --- Pan/Zoom ---
    def start_pan(self, event):
        self.drag_start_mouse = (event.x, event.y)
        self.drag_start_view = (self.view_offset_x, self.view_offset_y)

    def do_pan(self, event):
        dx = event.x - self.drag_start_mouse[0]
        dy = event.y - self.drag_start_mouse[1]
        self.view_offset_x = self.drag_start_view[0] + dx
        self.view_offset_y = self.drag_start_view[1] + dy
        self.redraw()

    def on_mouse_wheel(self, event):
        scale_factor = 1.1 if event.delta > 0 else 0.9
        self.zoom(event, scale_factor)

    def zoom(self, event, factor):
        # Zoom towards mouse
        mx = event.x
        my = event.y
        
        # World before zoom
        wx = (mx - self.view_offset_x) / self.view_scale
        wy = (my - self.view_offset_y) / self.view_scale
        
        self.view_scale *= factor
        self.view_scale = max(0.01, self.view_scale)
        
        # New offset to keep wx, wy at mx, my
        # mx = wx * new_scale + new_offset
        self.view_offset_x = mx - wx * self.view_scale
        self.view_offset_y = my - wy * self.view_scale
        
        self.redraw()

if __name__ == "__main__":
    app = SpriteAligner()
    app.mainloop()
